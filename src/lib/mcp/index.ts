import { auth, defineMcp } from "@lovable.dev/mcp-js";
import getMeTool from "./tools/get-me";
import listMarketplaceLeadsTool from "./tools/list-marketplace-leads";

// L'issuer OAuth doit être l'hôte Supabase direct (RFC 8414). Lu depuis le
// ref inliné par Vite au build; le fallback garde l'issuer bien formé pendant
// l'extraction de manifeste.
const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "soumissions-comptables-mcp",
  title: "SoumissionsComptables — Outils partenaires",
  version: "0.1.0",
  instructions:
    "Outils pour SoumissionsComptables.ci. Utilise `get_me` pour vérifier la connexion et récupérer le profil partenaire, puis `list_marketplace_leads` pour parcourir les leads actifs de la marketplace.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [getMeTool, listMarketplaceLeadsTool],
});