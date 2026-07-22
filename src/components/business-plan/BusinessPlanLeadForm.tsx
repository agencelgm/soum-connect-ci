import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { trackEvent } from "@/lib/analytics";
import { trackMetaConversion } from "@/lib/meta-pixel";
import { getTrackingFields } from "@/lib/lead-tracking";
import { toast } from "sonner";

type Step = 1 | 2 | 3;

const RAISONS = [
  "Demande de financement bancaire",
  "Présentation à des investisseurs",
  "Lancement d'une nouvelle entreprise",
  "Participation à un programme ou concours",
  "Organisation et validation du projet",
  "Autre",
];

const AVANCEMENTS = [
  "Je suis encore en réflexion",
  "Mon idée est déjà définie",
  "Mon entreprise est en cours de création",
  "Mon entreprise existe déjà",
  "Je souhaite développer une nouvelle activité",
];

const DELAIS = [
  "Moins de 2 semaines",
  "2 à 4 semaines",
  "1 à 2 mois",
  "Plus de 2 mois",
  "Pas de délai précis",
];

const BUDGETS = [
  "Moins de 100 000 FCFA",
  "Entre 100 000 et 250 000 FCFA",
  "Entre 250 000 et 500 000 FCFA",
  "Plus de 500 000 FCFA",
  "Je souhaite d'abord recevoir des propositions",
];

const CONTACTS: Array<{ id: "telephone" | "whatsapp" | "email"; label: string }> = [
  { id: "telephone", label: "Téléphone" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "email", label: "E-mail" },
];

export function BusinessPlanLeadForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [started, setStarted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [raison, setRaison] = useState("");
  const [avancement, setAvancement] = useState("");
  const [secteur, setSecteur] = useState("");
  const [description, setDescription] = useState("");
  const [ville, setVille] = useState("");
  const [delai, setDelai] = useState("");
  const [budget, setBudget] = useState("");
  const [nom, setNom] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [contactPref, setContactPref] = useState<"telephone" | "whatsapp" | "email">("whatsapp");
  const [consent, setConsent] = useState(false);

  function markStart() {
    if (started) return;
    setStarted(true);
    trackEvent("form_start", { form: "business_plan" });
  }

  function goStep2() {
    if (!raison || !avancement) {
      toast.error("Merci de répondre aux deux questions.");
      return;
    }
    trackEvent("form_step_1_complete", { form: "business_plan" });
    setStep(2);
  }

  function goStep3() {
    if (!secteur.trim() || description.trim().length < 10 || !ville.trim() || !delai) {
      toast.error("Merci de compléter tous les champs obligatoires.");
      return;
    }
    trackEvent("form_step_2_complete", { form: "business_plan" });
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
    trackEvent("form_submit", { form: "business_plan" });

    try {
      const res = await fetch("/api/public/business-plan-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "landing-business-plan",
          ...getTrackingFields(),
          raison,
          avancement,
          secteur,
          description,
          ville,
          delai,
          budget,
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
      trackEvent("business_plan_lead", { leadId: json.leadId });
      trackMetaConversion(
        "Lead",
        { content_name: "Business Plan", content_category: "business_plan" },
        { em: email, ph: mobile, fn: nom, ct: ville },
      );
      await navigate({ to: "/merci-demande-business-plan" });
    } catch {
      toast.error("Impossible d'envoyer votre demande. Réessayez dans un instant.");
      setSubmitting(false);
    }
  }

  return (
    <div id="formulaire" className="rounded-2xl bg-white border border-border shadow-lg p-5 md:p-7">
      <div className="mb-4">
        <p className="font-heading font-semibold text-primary text-lg">
          Recevez vos propositions gratuitement
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Parlez-nous de votre projet en quelques étapes.
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
                Pour quelle raison avez-vous besoin d'un business plan ?
              </label>
              <select
                value={raison}
                onChange={(e) => setRaison(e.target.value)}
                className="w-full min-h-11 rounded-md border border-input bg-white px-3 py-2 text-sm"
              >
                <option value="">Sélectionnez une option</option>
                {RAISONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Où en est actuellement votre projet ?
              </label>
              <select
                value={avancement}
                onChange={(e) => setAvancement(e.target.value)}
                className="w-full min-h-11 rounded-md border border-input bg-white px-3 py-2 text-sm"
              >
                <option value="">Sélectionnez une option</option>
                {AVANCEMENTS.map((r) => (
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
              <label className="block text-sm font-medium text-foreground mb-2">Secteur d'activité</label>
              <input
                value={secteur}
                onChange={(e) => setSecteur(e.target.value)}
                placeholder="Ex. Restauration, commerce, agriculture, tech…"
                className="w-full min-h-11 rounded-md border border-input bg-white px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Décrivez votre projet</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="En quelques phrases : ce que vous vendez, à qui, et votre objectif."
                className="w-full rounded-md border border-input bg-white px-3 py-2 text-sm"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Ville ou pays</label>
                <input
                  value={ville}
                  onChange={(e) => setVille(e.target.value)}
                  placeholder="Ex. Abidjan, Bouaké, France…"
                  className="w-full min-h-11 rounded-md border border-input bg-white px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Délai souhaité</label>
                <select
                  value={delai}
                  onChange={(e) => setDelai(e.target.value)}
                  className="w-full min-h-11 rounded-md border border-input bg-white px-3 py-2 text-sm"
                >
                  <option value="">Choisir</option>
                  {DELAIS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Budget indicatif <span className="text-muted-foreground font-normal">(facultatif)</span>
              </label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full min-h-11 rounded-md border border-input bg-white px-3 py-2 text-sm"
              >
                <option value="">Non précisé</option>
                {BUDGETS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
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
                J'accepte que mes informations soient utilisées pour traiter ma demande et me mettre en
                relation avec des professionnels.
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
                {submitting ? "Envoi en cours…" : "Recevoir mes soumissions gratuitement"}
              </button>
            </div>
            <p className="text-xs text-center text-muted-foreground">
              Gratuit, sans engagement et confidentiel.
            </p>
          </>
        )}
      </form>
    </div>
  );
}