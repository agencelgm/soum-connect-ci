import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";

/**
 * Garde-fou tunnel : un lead ne peut pas atteindre la page de remerciement
 * finale sans être passé par /formation-clients (upsell formation).
 * Ne s'applique qu'aux visiteurs venant réellement d'un formulaire
 * (leadId présent en sessionStorage) — les visites directes ne sont pas
 * redirigées.
 */
export function useFormationGate(finalPath: string) {
  const navigate = useNavigate();
  useEffect(() => {
    try {
      const leadId = sessionStorage.getItem("leadId");
      const seen = sessionStorage.getItem("formationChoice");
      if (!leadId || seen) return;
      sessionStorage.setItem("finalThankYouPath", finalPath);
      void navigate({ to: "/formation-clients" });
    } catch {
      /* sessionStorage indisponible : on laisse passer */
    }
  }, [finalPath, navigate]);
}
