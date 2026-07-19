import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/unsubscribe")({
  component: UnsubscribePage,
  head: () => ({
    meta: [
      { title: "Se désabonner — SoumissionsComptables.ci" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

type State =
  | { status: "loading" }
  | { status: "ready" }
  | { status: "already" }
  | { status: "invalid" }
  | { status: "success" }
  | { status: "error"; message: string };

function UnsubscribePage() {
  const [state, setState] = useState<State>({ status: "loading" });
  const [submitting, setSubmitting] = useState(false);
  const token =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("token")
      : null;

  useEffect(() => {
    if (!token) {
      setState({ status: "invalid" });
      return;
    }
    fetch(`/email/unsubscribe?token=${encodeURIComponent(token)}`)
      .then(async (r) => {
        const body = await r.json().catch(() => ({}));
        if (!r.ok) return setState({ status: "invalid" });
        if (body.valid) return setState({ status: "ready" });
        if (body.reason === "already_unsubscribed")
          return setState({ status: "already" });
        setState({ status: "invalid" });
      })
      .catch(() => setState({ status: "invalid" }));
  }, [token]);

  async function confirm() {
    if (!token) return;
    setSubmitting(true);
    try {
      const r = await fetch(`/email/unsubscribe`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const body = await r.json().catch(() => ({}));
      if (r.ok && body.success) setState({ status: "success" });
      else if (body.reason === "already_unsubscribed")
        setState({ status: "already" });
      else setState({ status: "error", message: body.error || "Une erreur est survenue." });
    } catch (e) {
      setState({ status: "error", message: (e as Error).message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm text-center">
        <h1 className="text-2xl font-bold text-foreground mb-3">
          Se désabonner
        </h1>
        {state.status === "loading" && (
          <p className="text-muted-foreground">Vérification en cours…</p>
        )}
        {state.status === "invalid" && (
          <p className="text-muted-foreground">
            Ce lien de désabonnement est invalide ou a expiré.
          </p>
        )}
        {state.status === "already" && (
          <p className="text-muted-foreground">
            Vous êtes déjà désabonné. Vous ne recevrez plus nos emails.
          </p>
        )}
        {state.status === "ready" && (
          <>
            <p className="text-muted-foreground mb-6">
              Confirmez-vous vouloir vous désabonner de nos emails ?
            </p>
            <button
              onClick={confirm}
              disabled={submitting}
              className="inline-flex items-center justify-center rounded-md bg-destructive px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? "Traitement…" : "Confirmer le désabonnement"}
            </button>
          </>
        )}
        {state.status === "success" && (
          <p className="text-emerald-600 font-medium">
            Vous avez été désabonné avec succès. Vous ne recevrez plus nos
            emails.
          </p>
        )}
        {state.status === "error" && (
          <p className="text-destructive">{state.message}</p>
        )}
      </div>
    </main>
  );
}