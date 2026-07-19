import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "crypto";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { getPackByProductId } from "@/lib/credit-packs";

// Chariow envoie ce webhook lorsqu'une licence est créée pour l'un de nos packs de crédits.
// Ce handler :
//   1. Vérifie la signature HMAC si CHARIOW_WEBHOOK_SECRET est configuré.
//   2. Extrait email + product_id + license_code (essais sur plusieurs noms de champs).
//   3. Crée une ligne dans chariow_payments (unique license_code -> idempotent).
//   4. Cherche un partenaire par email et crédite le solde si trouvé.
//
// Toujours répondre HTTP 200 quand le payload est techniquement valide même si le
// partenaire n'existe pas encore : Chariow ne rejoue pas indéfiniment, on garde une
// trace dans chariow_payments (status='unmatched') pour traitement manuel.

type ChariowPayload = Record<string, unknown> & {
  event?: string;
  data?: Record<string, unknown>;
  order?: Record<string, unknown>;
  customer?: Record<string, unknown>;
  license?: Record<string, unknown>;
  product?: Record<string, unknown>;
};

function pickString(obj: Record<string, unknown> | undefined, keys: string[]): string | null {
  if (!obj) return null;
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === "string" && v.trim() !== "") return v.trim();
  }
  return null;
}

function extractFields(payload: ChariowPayload) {
  const root = payload;
  const data = (payload.data as Record<string, unknown> | undefined) ?? {};
  const order = (payload.order ?? data.order) as Record<string, unknown> | undefined;
  const customer = (payload.customer ?? data.customer ?? order?.customer) as Record<string, unknown> | undefined;
  const license = (payload.license ?? data.license) as Record<string, unknown> | undefined;
  const product = (payload.product ?? data.product ?? order?.product) as Record<string, unknown> | undefined;
  const metadata =
    (payload.metadata ??
      (data as Record<string, unknown>).metadata ??
      (order as Record<string, unknown> | undefined)?.metadata ??
      (license as Record<string, unknown> | undefined)?.metadata ??
      (product as Record<string, unknown> | undefined)?.metadata) as Record<string, unknown> | undefined;
  const customFields =
    (payload.custom_fields ??
      (data as Record<string, unknown>).custom_fields ??
      (order as Record<string, unknown> | undefined)?.custom_fields) as Record<string, unknown> | undefined;

  const email =
    pickString(customer, ["email", "customer_email", "buyer_email"]) ??
    pickString(order, ["email", "customer_email", "buyer_email"]) ??
    pickString(data, ["email", "customer_email", "buyer_email"]) ??
    pickString(root, ["email", "customer_email", "buyer_email"]);

  const productId =
    pickString(product, ["id", "product_id"]) ??
    pickString(order, ["product_id", "productId"]) ??
    pickString(license, ["product_id", "productId"]) ??
    pickString(data, ["product_id", "productId"]) ??
    pickString(root, ["product_id", "productId"]);

  const licenseCode =
    pickString(license, ["code", "key", "license_code", "license_key"]) ??
    pickString(data, ["license_code", "license_key", "code"]) ??
    pickString(root, ["license_code", "license_key", "code"]);

  const partnerId =
    pickString(metadata, ["partner_id", "partnerId"]) ??
    pickString(customFields, ["partner_id", "partnerId"]) ??
    pickString(customer, ["reference", "customer_reference", "partner_id"]) ??
    pickString(order, ["reference", "customer_reference", "partner_id"]) ??
    pickString(root, ["reference", "customer_reference", "partner_id"]);

  return { email, productId, licenseCode, partnerId };
}

export const Route = createFileRoute("/api/public/chariow-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const rawBody = await request.text();

        // 1) Vérification de signature (optionnelle si secret non configuré)
        const secret = process.env.CHARIOW_WEBHOOK_SECRET;
        if (secret) {
          const signature =
            request.headers.get("x-chariow-signature") ??
            request.headers.get("x-signature") ??
            request.headers.get("x-webhook-signature");
          if (!signature) {
            return new Response("Missing signature", { status: 401 });
          }
          const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
          const provided = signature.replace(/^sha256=/, "");
          const a = Buffer.from(provided);
          const b = Buffer.from(expected);
          if (a.length !== b.length || !timingSafeEqual(a, b)) {
            return new Response("Invalid signature", { status: 401 });
          }
        }

        // 2) Parse payload
        let payload: ChariowPayload;
        try {
          payload = JSON.parse(rawBody) as ChariowPayload;
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }

        const { email, productId, licenseCode, partnerId } = extractFields(payload);

        if (!email || !productId || !licenseCode) {
          console.error("[chariow-webhook] missing fields", { email, productId, licenseCode, payload });
          return Response.json(
            { ok: false, error: "missing_fields", got: { email, productId, licenseCode } },
            { status: 400 },
          );
        }

        const normalizedEmail = email.toLowerCase();
        const pack = getPackByProductId(productId);

        // 3) Idempotence : insert le code de licence (unique)
        const { data: existing } = await supabaseAdmin
          .from("chariow_payments")
          .select("id, status")
          .eq("license_code", licenseCode)
          .maybeSingle();
        if (existing) {
          return Response.json({ ok: true, deduped: true, status: existing.status });
        }

        const { data: payment, error: insertErr } = await supabaseAdmin
          .from("chariow_payments")
          .insert({
            license_code: licenseCode,
            product_id: productId,
            email: normalizedEmail,
            credits_granted: 0,
            amount_label: pack?.price ?? null,
            status: "pending",
            // jsonb column — cast via JSON round-trip to satisfy the generated Json type.
            raw_payload: JSON.parse(JSON.stringify(payload)),
          })
          .select("id")
          .single();
        if (insertErr || !payment) {
          console.error("[chariow-webhook] insert error", insertErr);
          return Response.json({ ok: false, error: "insert_failed" }, { status: 500 });
        }

        // 4) Trouver le partenaire par email + créditer
        if (!pack) {
          await supabaseAdmin
            .from("chariow_payments")
            .update({ status: "error", error_message: "unknown_product_id", processed_at: new Date().toISOString() })
            .eq("id", payment.id);
          return Response.json({ ok: false, error: "unknown_product_id" }, { status: 200 });
        }

        // Match : 1) partner_id passé en metadata Chariow, 2) fallback email exact.
        let partner: { id: string; credits_balance: number | null; email: string } | null = null;
        if (partnerId) {
          const { data } = await supabaseAdmin
            .from("partners")
            .select("id, credits_balance, email")
            .eq("id", partnerId)
            .is("deleted_at", null)
            .maybeSingle();
          partner = data ?? null;
        }
        if (!partner) {
          const { data } = await supabaseAdmin
            .from("partners")
            .select("id, credits_balance, email")
            .ilike("email", normalizedEmail)
            .is("deleted_at", null)
            .maybeSingle();
          partner = data ?? null;
        }
        // 3) Fallback : email correspond à un profile -> partner.profile_id
        if (!partner) {
          const { data: profile } = await supabaseAdmin
            .from("profiles")
            .select("id")
            .ilike("email", normalizedEmail)
            .maybeSingle();
          if (profile) {
            const { data } = await supabaseAdmin
              .from("partners")
              .select("id, credits_balance, email")
              .eq("profile_id", profile.id)
              .is("deleted_at", null)
              .maybeSingle();
            partner = data ?? null;
          }
        }
        // 4) Fallback : intention de paiement non consommée pour ce produit (<30 min)
        let consumedIntentId: string | null = null;
        if (!partner) {
          const thirtyMinAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
          const { data: intent } = await supabaseAdmin
            .from("chariow_payment_intents")
            .select("id, partner_id")
            .eq("product_id", productId)
            .is("consumed_at", null)
            .gte("created_at", thirtyMinAgo)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();
          if (intent) {
            const { data } = await supabaseAdmin
              .from("partners")
              .select("id, credits_balance, email")
              .eq("id", intent.partner_id)
              .is("deleted_at", null)
              .maybeSingle();
            if (data) {
              partner = data;
              consumedIntentId = intent.id;
            }
          }
        }

        if (!partner) {
          await supabaseAdmin
            .from("chariow_payments")
            .update({ status: "unmatched", processed_at: new Date().toISOString() })
            .eq("id", payment.id);
          // 200 pour que Chariow ne réessaie pas indéfiniment ; à traiter manuellement.
          return Response.json({ ok: true, matched: false });
        }

        // Récupère l'état actuel (credits + unlimited_until) pour empiler correctement
        const { data: current } = await supabaseAdmin
          .from("partners")
          .select("credits_balance, unlimited_until")
          .eq("id", partner.id)
          .maybeSingle();
        const currentBalance = current?.credits_balance ?? partner.credits_balance ?? 0;
        const currentUnlimitedUntil = current?.unlimited_until ? new Date(current.unlimited_until) : null;

        let newBalance = currentBalance;
        let newUnlimitedUntil: string | null = current?.unlimited_until ?? null;
        const updatePatch: Record<string, unknown> = {};

        if (pack.unlimited && pack.unlimitedDays) {
          const now = new Date();
          const base = currentUnlimitedUntil && currentUnlimitedUntil > now ? currentUnlimitedUntil : now;
          const next = new Date(base.getTime() + pack.unlimitedDays * 24 * 60 * 60 * 1000);
          newUnlimitedUntil = next.toISOString();
          updatePatch.unlimited_until = newUnlimitedUntil;
        } else {
          newBalance = currentBalance + pack.credits;
          updatePatch.credits_balance = newBalance;
        }

        const { error: balErr } = await supabaseAdmin
          .from("partners")
          .update(updatePatch)
          .eq("id", partner.id);
        if (balErr) {
          await supabaseAdmin
            .from("chariow_payments")
            .update({ status: "error", error_message: balErr.message, processed_at: new Date().toISOString() })
            .eq("id", payment.id);
          return Response.json({ ok: false, error: "credit_update_failed" }, { status: 500 });
        }

        await supabaseAdmin.from("credit_transactions").insert({
          partner_id: partner.id,
          amount: pack.unlimited ? 0 : pack.credits,
          balance_after: newBalance,
          tx_type: pack.unlimited ? "chariow_unlimited" : "chariow_purchase",
          reference_id: payment.id,
          note: pack.unlimited
            ? `Achat Chariow — Accès illimité ${pack.unlimitedDays} jours (${pack.price}) — licence ${licenseCode}`
            : `Achat Chariow (${pack.price}) — licence ${licenseCode}`,
          created_by: null,
        });

        await supabaseAdmin
          .from("chariow_payments")
          .update({
            status: "credited",
            partner_id: partner.id,
            credits_granted: pack.unlimited ? 0 : pack.credits,
            processed_at: new Date().toISOString(),
          })
          .eq("id", payment.id);

        if (consumedIntentId) {
          await supabaseAdmin
            .from("chariow_payment_intents")
            .update({ consumed_at: new Date().toISOString(), chariow_payment_id: payment.id })
            .eq("id", consumedIntentId);
        }

        return Response.json({
          ok: true,
          matched: true,
          credits_added: pack.unlimited ? 0 : pack.credits,
          new_balance: newBalance,
          unlimited_until: newUnlimitedUntil,
        });
      },
    },
  },
});