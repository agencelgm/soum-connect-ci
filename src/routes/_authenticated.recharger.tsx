import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { getMyPartner } from "@/lib/partners.functions";
import { claimChariowPayment, createChariowIntent } from "@/lib/chariow.functions";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CREDIT_PACKS } from "@/lib/credit-packs";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ArrowLeft, Check, Coins, Copy, Crown, HelpCircle, History, Infinity as InfinityIcon, Mail, ShieldCheck, Zap } from "lucide-react";

export const Route = createFileRoute("/_authenticated/recharger")({
  head: () => ({ meta: [{ title: "Recharger mes crédits" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: RechargerPage,
});

declare global {
  interface Window {
    Chariow?: { initializeWidget?: () => void };
  }
}

function ChariowButton({
  productId,
  ctaText,
  partnerId,
  onIntent,
}: {
  productId: string;
  ctaText: string;
  partnerId?: string;
  onIntent?: (productId: string) => void;
}) {
  return (
    <div
      onClickCapture={() => onIntent?.(productId)}
      onPointerDownCapture={() => onIntent?.(productId)}
    >
      <div
        id="chariow-widget"
        data-product-id={productId}
        data-store-domain="academielgm.com"
        data-style="tap"
        data-border-style="rounded"
        data-cta-width="xs"
        data-cta-animation="pulse_glow"
        data-locale="fr"
        data-primary-color="#ffcc00"
        data-background-color="#FFFFFF"
        data-custom-cta-text={ctaText}
        data-metadata-partner-id={partnerId ?? ""}
        data-customer-reference={partnerId ?? ""}
      />
    </div>
  );
}

function useChariowLoader(deps: unknown[]) {
  useEffect(() => {
    if (!document.querySelector('link[href="https://js.chariowcdn.com/v1/widget.min.css"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://js.chariowcdn.com/v1/widget.min.css";
      document.head.appendChild(link);
    }

    const init = () => {
      try {
        window.Chariow?.initializeWidget?.();
      } catch (e) {
        console.error("Chariow init failed", e);
      }
    };

    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://js.chariowcdn.com/v1/widget.min.js"]',
    );
    if (existing && window.Chariow?.initializeWidget) {
      // Script already loaded — re-scan the newly mounted widgets
      init();
    } else {
      if (existing) existing.remove();
      const script = document.createElement("script");
      script.src = "https://js.chariowcdn.com/v1/widget.min.js";
      script.async = true;
      script.onload = init;
      document.head.appendChild(script);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

function RechargerPage() {
  const meFn = useServerFn(getMyPartner);
  const { data } = useQuery({
    queryKey: ["my-partner"],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) return null;
      return meFn();
    },
    retry: false,
  });
  const partner = data?.partner;
  useChariowLoader([CREDIT_PACKS.length, partner?.id ?? ""]);

  const queryClient = useQueryClient();
  const claimFn = useServerFn(claimChariowPayment);
  const intentFn = useServerFn(createChariowIntent);
  const [licenseCode, setLicenseCode] = useState("");

  const handleIntent = (productId: string) => {
    // Best-effort : on enregistre l'intention pour que le webhook puisse
    // rattacher le paiement même si Chariow ne renvoie ni metadata ni email correspondant.
    intentFn({ data: { productId } }).catch((e) => {
      console.warn("[chariow] intent registration failed", e);
    });
  };

  const claim = useMutation({
    mutationFn: (code: string) => claimFn({ data: { licenseCode: code } }),
    onSuccess: (res) => {
      toast.success(`${res.credits_added} crédits ajoutés. Nouveau solde : ${res.new_balance}.`);
      setLicenseCode("");
      queryClient.invalidateQueries({ queryKey: ["my-partner"] });
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Impossible de réclamer ce paiement.";
      toast.error(msg);
    },
  });

  const accountEmail = partner?.email ?? data?.profile?.email ?? "";
  const unlimitedUntilRaw = (partner as { unlimited_until?: string | null } | undefined)?.unlimited_until ?? null;
  const unlimitedUntil = unlimitedUntilRaw ? new Date(unlimitedUntilRaw) : null;
  const isUnlimitedActive = !!(unlimitedUntil && unlimitedUntil.getTime() > Date.now());
  const unlimitedDaysLeft = isUnlimitedActive && unlimitedUntil
    ? Math.max(0, Math.ceil((unlimitedUntil.getTime() - Date.now()) / (24 * 60 * 60 * 1000)))
    : 0;

  return (
    <div className="min-h-full flex flex-col justify-center -my-6 lg:-my-8 py-10 lg:py-14 bg-gradient-to-b from-background via-background to-muted/40">
      <div className="w-full max-w-6xl mx-auto px-2">
        <div className="flex items-center justify-between mb-6">
          <Button asChild variant="ghost" size="sm" className="-ml-2 text-muted-foreground hover:text-foreground">
            <Link to="/marketplace"><ArrowLeft className="h-4 w-4 mr-1" /> Retour à la marketplace</Link>
          </Button>
          {partner && (
            <div className="flex items-center gap-2">
              {isUnlimitedActive && (
                <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-gradient-to-r from-amber-100 to-yellow-100 px-3 py-1.5 text-sm shadow-sm">
                  <Crown className="h-4 w-4 text-amber-600" />
                  <span className="font-semibold text-amber-900">Illimité actif</span>
                  <span className="text-amber-800">· {unlimitedDaysLeft} j restants</span>
                </div>
              )}
              <div className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-sm shadow-sm">
                <Coins className="h-4 w-4 text-primary" />
                <span className="font-semibold">{partner.credits_balance}</span>
                <span className="text-muted-foreground">crédits</span>
              </div>
            </div>
          )}
        </div>

        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary uppercase tracking-wider mb-4">
            <ShieldCheck className="h-3.5 w-3.5" /> Paiement sécurisé
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Rechargez vos crédits
          </h1>
          <p className="mt-3 text-base md:text-lg text-muted-foreground">
            Choisissez un pack et débloquez instantanément des leads qualifiés de cabinets comptables en Côte d'Ivoire.
          </p>
          {accountEmail && (
            <div className="mt-5 inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-sm">
              <Mail className="h-4 w-4 text-primary shrink-0" />
              <span className="text-muted-foreground">Payez avec votre email :</span>
              <span className="font-medium font-mono text-foreground">{accountEmail}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 px-2"
                onClick={() => {
                  navigator.clipboard.writeText(accountEmail).then(
                    () => toast.success("Email copié."),
                    () => toast.error("Impossible de copier."),
                  );
                }}
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>

        {isUnlimitedActive && (
          <div className="max-w-3xl mx-auto mb-8 rounded-2xl border border-amber-300 bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 p-5 flex items-center gap-4">
            <Crown className="h-8 w-8 text-amber-600 shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-amber-900">Votre accès illimité est actif</p>
              <p className="text-sm text-amber-800">
                Débloquez autant de leads que vous voulez sans consommer vos crédits jusqu'au{" "}
                <strong>{unlimitedUntil?.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</strong>.
                Vos {partner?.credits_balance ?? 0} crédits restent conservés et redeviendront utilisables à l'expiration.
              </p>
            </div>
            <Button asChild variant="outline" size="sm" className="border-amber-400 text-amber-900 hover:bg-amber-100">
              <Link to="/historique">
                <History className="h-4 w-4 mr-1.5" />
                Historique
              </Link>
            </Button>
          </div>
        )}

        <div className="max-w-4xl mx-auto mb-10 rounded-2xl border bg-card overflow-hidden">
          <div className="px-5 py-3 border-b bg-muted/30">
            <h2 className="font-semibold">Comparez les 3 formules</h2>
            <p className="text-xs text-muted-foreground">1 lead débloqué = coordonnées complètes du prospect (nom, email, téléphone, entreprise).</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/20 text-left">
                <tr>
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">Formule</th>
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">Prix</th>
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">Ce que vous obtenez</th>
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">Déduction crédits</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="px-4 py-3 font-semibold">Starter</td>
                  <td className="px-4 py-3">10 000 FCFA</td>
                  <td className="px-4 py-3">50 prospects débloquables (200 FCFA / prospect)</td>
                  <td className="px-4 py-3 text-muted-foreground">–1 crédit par déblocage</td>
                </tr>
                <tr className="bg-primary/5">
                  <td className="px-4 py-3 font-semibold">
                    Pro <span className="ml-1 rounded-full bg-primary text-primary-foreground px-2 py-0.5 text-[10px] uppercase font-bold">Populaire</span>
                  </td>
                  <td className="px-4 py-3">25 000 FCFA</td>
                  <td className="px-4 py-3">125 prospects débloquables (200 FCFA / prospect)</td>
                  <td className="px-4 py-3 text-muted-foreground">–1 crédit par déblocage</td>
                </tr>
                <tr className="bg-amber-50/60">
                  <td className="px-4 py-3 font-semibold text-amber-900">
                    Illimité <Crown className="inline h-3.5 w-3.5 text-amber-600 ml-0.5" />
                  </td>
                  <td className="px-4 py-3">50 000 FCFA</td>
                  <td className="px-4 py-3"><strong>Prospects illimités</strong> pendant <strong>30 jours calendaires</strong></td>
                  <td className="px-4 py-3 text-emerald-700 font-medium">Aucune déduction · vos crédits sont gelés</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t bg-muted/20 text-xs text-muted-foreground">
            Rachat de l'illimité avant expiration : les 30 nouveaux jours s'<strong>ajoutent</strong> aux jours restants.
            Vos crédits Starter/Pro ne périment jamais.
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3 items-stretch">
          {CREDIT_PACKS.map((pack) => {
            const priceNum = parseInt(pack.price.replace(/\D/g, ""), 10);
            const pricePerCredit = pack.unlimited ? 0 : Math.round(priceNum / pack.credits);
            const isUnlimitedPack = !!pack.unlimited;
            return (
              <div
                key={pack.productId}
                className={cn(
                  "relative rounded-2xl border bg-card p-7 flex flex-col transition-all",
                  isUnlimitedPack
                    ? "border-amber-300 shadow-xl shadow-amber-500/10 bg-gradient-to-b from-amber-50/70 to-card"
                    : pack.popular
                    ? "border-primary/60 shadow-xl shadow-primary/10 md:scale-[1.04] md:-translate-y-1 bg-gradient-to-b from-primary/5 to-card"
                    : "border-border/60 shadow-sm hover:shadow-md hover:border-border",
                )}
              >
                {pack.popular && !isUnlimitedPack && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary text-primary-foreground px-4 py-1 text-[11px] font-bold uppercase tracking-wider shadow-md">
                    Le plus choisi
                  </span>
                )}
                {isUnlimitedPack && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-4 py-1 text-[11px] font-bold uppercase tracking-wider shadow-md">
                    Meilleure valeur
                  </span>
                )}

                <div className="flex items-baseline gap-2">
                  {isUnlimitedPack ? (
                    <>
                      <Crown className="h-5 w-5 text-amber-600" />
                      <div className="text-5xl font-bold leading-none tracking-tight text-amber-900">Illimité</div>
                    </>
                  ) : (
                    <>
                      <Zap className={cn("h-5 w-5", pack.popular ? "text-primary" : "text-muted-foreground")} />
                      <div className="text-6xl font-bold leading-none tracking-tight">{pack.credits}</div>
                      <div className="text-sm text-muted-foreground">crédits</div>
                    </>
                  )}
                </div>

                <div className="mt-5 pb-5 border-b">
                  <div className="text-3xl font-bold">{pack.price}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {isUnlimitedPack
                      ? `Pour ${pack.unlimitedDays} jours calendaires`
                      : `soit ${pricePerCredit.toLocaleString("fr-FR")} FCFA / crédit`}
                  </div>
                </div>

                <ul className="mt-5 space-y-2.5 text-sm flex-1">
                  {isUnlimitedPack ? (
                    <>
                      <li className="flex items-start gap-2">
                        <InfinityIcon className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                        <span><strong>Déblocages illimités</strong> de leads pendant 30 jours</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                        <span>Vos crédits accumulés sont <strong>conservés</strong> et réutilisables ensuite</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                        <span>Rachat = les jours restants s'<strong>ajoutent</strong> à la période active</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                        <span>Sans abonnement, à racheter manuellement chaque mois</span>
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <span>1 crédit = 1 lead débloqué (coordonnées complètes)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <span>Crédits livrés instantanément après paiement</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <span>Crédits <strong>non expirants</strong> — reportés d'un mois à l'autre</span>
                      </li>
                    </>
                  )}
                </ul>

                <div className="mt-6">
                  <ChariowButton
                    productId={pack.productId}
                    ctaText={isUnlimitedPack
                      ? (isUnlimitedActive ? "Prolonger de 30 jours" : "Activer l'illimité")
                      : `Recharger ${pack.credits} crédits`}
                    partnerId={partner?.id}
                    onIntent={handleIntent}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 max-w-2xl mx-auto rounded-2xl border border-border/60 bg-card/60 p-6">
          <div className="flex items-start gap-3">
            <HelpCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div className="flex-1">
              <h2 className="text-base font-semibold">J'ai payé mais je n'ai pas reçu mes crédits</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Si vous avez payé avec un email différent de celui de votre compte, collez ici le code
                de licence reçu par email de Chariow pour rattacher le paiement à ce compte.
              </p>
              <form
                className="mt-4 flex flex-col sm:flex-row gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  const code = licenseCode.trim();
                  if (code.length < 4) {
                    toast.error("Code invalide.");
                    return;
                  }
                  claim.mutate(code);
                }}
              >
                <Input
                  value={licenseCode}
                  onChange={(e) => setLicenseCode(e.target.value)}
                  placeholder="Ex. PYDL-YK6O-9HFT-D8L2"
                  className="font-mono uppercase"
                  disabled={claim.isPending}
                />
                <Button type="submit" disabled={claim.isPending}>
                  {claim.isPending ? "Vérification…" : "Réclamer mes crédits"}
                </Button>
              </form>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-10 flex items-center justify-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5" />
          Paiement traité par Chariow — aucune donnée bancaire stockée sur nos serveurs
        </p>
      </div>
    </div>
  );
}