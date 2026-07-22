import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { trackEvent } from "@/lib/analytics";
import { trackMetaConversion } from "@/lib/meta-pixel";
import { getTrackingFields } from "@/lib/lead-tracking";
import { toast } from "sonner";

type Step = 1 | 2 | 3;

const ACTIVITES = [
  "Oui, mon entreprise est déjà en activité",
  "Non, le projet est en préparation",
];

const TYPES = [
  "Crédit bancaire",
  "Investisseur privé",
  "Fonds d'investissement",
  "Financement de matériel",
  "Financement de trésorerie",
  "Financement pour lancement d'activité",
  "Autre",
];

const MONTANTS = [
  "Moins de 5 millions FCFA",
  "Entre 5 et 20 millions FCFA",
  "Entre 20 et 50 millions FCFA",
  "Entre 50 et 100 millions FCFA",
  "Plus de 100 millions FCFA",
  "Je ne sais pas encore",
];

const DOCUMENTS = [
  "Oui, j'ai déjà une partie du dossier",
  "Non, je dois commencer",
  "Je ne sais pas quels documents préparer",
];

const CONTACTS: Array<{ id: "telephone" | "whatsapp" | "email"; label: string }> = [
  { id: "telephone", label: "Téléphone" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "email", label: "E-mail" },
];

export function FinancingLeadForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [started, setStarted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [activite, setActivite] = useState("");
  const [typeFinancement, setTypeFinancement] = useState("");
  const [montant, setMontant] = useState("");
  const [documents, setDocuments] = useState("");
  const [entreprise, setEntreprise] = useState("");
  const [description, setDescription] = useState("");
  const [ville, setVille] = useState("");
  const [nom, setNom] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [contactPref, setContactPref] = useState<"telephone" | "whatsapp" | "email">("whatsapp");
  const [consent, setConsent] = useState(false);

  function markStart() {
    if (started) return;
    setStarted(true);
    trackEvent("form_start", { form: "financing" });
  }

  function goStep2() {
    if (!activite || !typeFinancement || !montant || !documents) {
      toast.error("Merci de répondre à toutes les questions.");
      return;
    }
    trackEvent("form_step_1_complete", { form: "financing" });
    setStep(2);
  }

  function goStep3() {
    if (!entreprise.trim() || description.trim().length < 10 || !ville.trim()) {
      toast.error("Merci de compléter tous les champs obligatoires.");
      return;
    }
    trackEvent("form_step_2_complete", { form: "financing" });
    setStep(3);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    if (!nom.trim() || !mobile.trim() || !email.trim() || !consent) {
      toast.error("Merci de compléter vos coordonnées et d'accepter les conditions.");
      return;
    }
    setSubmitting(true);
    trackEvent("form_submit", { form: "financing" });

    try {
      const res = await fetch("/api/public/financing-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "landing-financement",
          ...getTrackingFields(),
          activite,
          typeFinancement,
          montant,
          documents,
          entreprise,
          description,
          ville,
          nom,
          mobile,
          email,
          contactPref,
          consent,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; leadId?: string };
      if (!res.ok || !json.ok) {
        throw new Error("submit failed");
      }
      trackEvent("financing_lead", { leadId: json.leadId });
      trackMetaConversion(
        "Lead",
        { content_name: "Montage dossier financement", content_category: "financement" },
        { em: email, ph: mobile, fn: nom, ct: ville },
      );
      await navigate({ to: "/merci-demande-financement" });
    } catch {
      toast.error("Impossible d'envoyer votre demande. Réessayez dans un instant.");
      setSubmitting(false);
    }
  }

  return (
    <div id="formulaire" className="rounded-2xl bg-white border border-border shadow-lg p-5 md:p-7">
      <div className="mb-4">
        <p className="font-heading font-semibold text-primary text-lg">
          Parlez-nous de votre besoin de financement
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Remplissez ce formulaire pour recevoir plusieurs propositions de professionnels.
        </p>
        <div className="mt-3 flex items-center gap-2">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className={`h-1.5 flex-1 rounded-full ${n <= step ? "bg-secondary" : "bg-muted"}`}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2">Étape {step} sur 3</p>
      </div>

      <form onSubmit={submit} onFocus={markStart} className="space-y-4">
        {step === 1 && (
          <>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Votre entreprise est-elle déjà en activité ?
              </label>
              <select
                value={activite}
                onChange={(e) => setActivite(e.target.value)}
                className="w-full min-h-11 rounded-md border border-input bg-white px-3 py-2 text-sm"
              >
                <option value="">Sélectionnez une option</option>
                {ACTIVITES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Quel type de financement recherchez-vous ?
              </label>
              <select
                value={typeFinancement}
                onChange={(e) => setTypeFinancement(e.target.value)}
                className="w-full min-h-11 rounded-md border border-input bg-white px-3 py-2 text-sm"
              >
                <option value="">Sélectionnez une option</option>
                {TYPES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Quel est le montant approximatif recherché ?
              </label>
              <select
                value={montant}
                onChange={(e) => setMontant(e.target.value)}
                className="w-full min-h-11 rounded-md border border-input bg-white px-3 py-2 text-sm"
              >
                <option value="">Sélectionnez une option</option>
                {MONTANTS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Avez-vous déjà préparé certains documents ?
              </label>
              <select
                value={documents}
                onChange={(e) => setDocuments(e.target.value)}
                className="w-full min-h-11 rounded-md border border-input bg-white px-3 py-2 text-sm"
              >
                <option value="">Sélectionnez une option</option>
                {DOCUMENTS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={goStep2}
              className="w-full min-h-12 rounded-lg bg-secondary text-white font-semibold hover:bg-secondary-dark transition"
            >
              Continuer
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Nom de l'entreprise ou du projet
              </label>
              <input
                value={entreprise}
                onChange={(e) => setEntreprise(e.target.value)}
                placeholder="Ex. Ma société SARL, Projet boulangerie…"
                className="w-full min-h-11 rounded-md border border-input bg-white px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Décrivez brièvement votre projet ou votre besoin
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="En quelques phrases : votre activité, l'objectif du financement, l'utilisation prévue des fonds."
                className="w-full rounded-md border border-input bg-white px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Ville</label>
              <input
                value={ville}
                onChange={(e) => setVille(e.target.value)}
                placeholder="Ex. Abidjan, Bouaké…"
                className="w-full min-h-11 rounded-md border border-input bg-white px-3 py-2 text-sm"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 min-h-12 rounded-lg border border-input bg-white font-semibold text-foreground hover:bg-muted transition"
              >
                Retour
              </button>
              <button
                type="button"
                onClick={goStep3}
                className="flex-[2] min-h-12 rounded-lg bg-secondary text-white font-semibold hover:bg-secondary-dark transition"
              >
                Continuer
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Nom et prénom</label>
              <input
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className="w-full min-h-11 rounded-md border border-input bg-white px-3 py-2 text-sm"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Téléphone / WhatsApp</label>
                <input
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="+225 …"
                  inputMode="tel"
                  className="w-full min-h-11 rounded-md border border-input bg-white px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Adresse e-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full min-h-11 rounded-md border border-input bg-white px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Moyen de contact préféré</label>
              <div className="grid grid-cols-3 gap-2">
                {CONTACTS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setContactPref(c.id)}
                    className={`min-h-11 rounded-md border px-3 py-2 text-sm font-medium transition ${
                      contactPref === c.id
                        ? "border-secondary bg-secondary/10 text-secondary"
                        : "border-input bg-white text-foreground hover:bg-muted"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
            <label className="flex items-start gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 h-4 w-4"
              />
              <span>
                J'accepte d'être contacté dans le cadre de ma demande.
              </span>
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex-1 min-h-12 rounded-lg border border-input bg-white font-semibold text-foreground hover:bg-muted transition"
              >
                Retour
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-[2] min-h-12 rounded-lg bg-secondary text-white font-semibold hover:bg-secondary-dark transition disabled:opacity-60"
              >
                {submitting ? "Envoi en cours…" : "Recevoir mes propositions"}
              </button>
            </div>
            <p className="text-xs text-center text-muted-foreground">
              Votre demande est gratuite et sans engagement.
            </p>
          </>
        )}
      </form>
    </div>
  );
}