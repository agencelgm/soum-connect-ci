# Corriger l'erreur de publication d'un prospect

## Cause
`src/lib/marketplace.functions.ts` importe `notifyProspectApproved` au niveau module depuis `src/lib/ghl-prospect-approved.server.ts`. Ce dernier importe `supabaseAdmin` depuis `@/integrations/supabase/client.server` au niveau module.

Les fichiers `*.functions.ts` sont dans le graphe client (seul le corps des `.handler()` est retiré du bundle). Tout fichier qui matche `*.server.*` est bloqué côté client. Conséquence : dès qu'on appelle `publishProspect`, l'import statique du module serveur fait échouer l'appel ("Publication impossible / erreur serveur").

## Correctif
Dans `src/lib/marketplace.functions.ts` :
- Supprimer l'import top-level `import { notifyProspectApproved } from "./ghl-prospect-approved.server"`.
- À l'intérieur du `.handler()` de `publishProspect`, charger le module en dynamique juste avant l'appel :
  ```ts
  const { notifyProspectApproved } = await import("./ghl-prospect-approved.server");
  await notifyProspectApproved(data.prospect_id, publicationId);
  ```

C'est le pattern documenté pour utiliser `supabaseAdmin` depuis un `*.functions.ts`.

## Vérification
- Publier un prospect depuis `/admin?tab=prospects` : plus d'erreur, le lead apparaît dans la Marketplace.
- Vérifier dans GHL que le payload `prospect_approved` est bien reçu.
