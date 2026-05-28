import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { getPackByProductId } from "./credit-packs";

// Réclamation manuelle d'un paiement Chariow (cas où l'email d'achat
// diffère de l'email partenaire, ou tout autre mismatch).
// Le partenaire connecté fournit le code de licence reçu par email,
// et on lui crédite le pack si ce paiement n'a pas encore été attribué.

const ClaimSchema = z.object({
  licenseCode: z
    .string()
    .trim()
    .min(4)
    .max(64)
    .regex(/^[A-Za-z0-9-]+$/, "Code invalide"),
});

export const claimChariowPayment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => ClaimSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { userId } = context;
    const licenseCode = data.licenseCode.toUpperCase();

    // 1) Trouver le partenaire du user courant
    const { data: partner, error: partnerErr } = await supabaseAdmin
      .from("partners")
      .select("id, credits_balance")
      .eq("profile_id", userId)
      .is("deleted_at", null)
      .maybeSingle();
    if (partnerErr) throw new Error(partnerErr.message);
    if (!partner) throw new Error("Aucun compte partenaire trouvé.");

    // 2) Trouver le paiement Chariow par licence
    const { data: payment, error: payErr } = await supabaseAdmin
      .from("chariow_payments")
      .select("id, status, product_id, partner_id, credits_granted")
      .eq("license_code", licenseCode)
      .maybeSingle();
    if (payErr) throw new Error(payErr.message);
    if (!payment) {
      throw new Error("Ce code de licence est inconnu. Vérifiez le code dans votre email Chariow.");
    }
    if (payment.status === "credited") {
      throw new Error("Ce paiement a déjà été crédité.");
    }
    if (payment.partner_id && payment.partner_id !== partner.id) {
      throw new Error("Ce paiement est déjà rattaché à un autre compte.");
    }

    const pack = getPackByProductId(payment.product_id);
    if (!pack) {
      throw new Error("Produit inconnu pour ce paiement. Contactez le support.");
    }

    const newBalance = (partner.credits_balance ?? 0) + pack.credits;

    // 3) Créditer le partenaire
    const { error: balErr } = await supabaseAdmin
      .from("partners")
      .update({ credits_balance: newBalance })
      .eq("id", partner.id);
    if (balErr) throw new Error(balErr.message);

    await supabaseAdmin.from("credit_transactions").insert({
      partner_id: partner.id,
      amount: pack.credits,
      balance_after: newBalance,
      tx_type: "chariow_purchase",
      reference_id: payment.id,
      note: `Achat Chariow (${pack.price}) — licence ${licenseCode} (réclamation manuelle)`,
      created_by: userId,
    });

    await supabaseAdmin
      .from("chariow_payments")
      .update({
        status: "credited",
        partner_id: partner.id,
        credits_granted: pack.credits,
        processed_at: new Date().toISOString(),
      })
      .eq("id", payment.id);

    return { ok: true, credits_added: pack.credits, new_balance: newBalance };
  });