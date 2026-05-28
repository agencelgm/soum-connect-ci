# Corrections marketplace & affichage des réponses

## 1. Afficher le « délai souhaité » sur la carte lead (visible avant déblocage)

Le délai est déjà collecté par le formulaire et stocké dans `prospects.raw_payload.delai`, mais il n'est ni dans la table `lead_publications` ni dans la réponse `listMarketplace`. À corriger :

- **`src/lib/marketplace.functions.ts` → `listMarketplace`** : après avoir récupéré les `lead_publications`, charger en une requête les `prospects` correspondants (`prospect_id`) et extraire uniquement les champs non-PII / non-internes du `raw_payload` : `delai`, et éventuellement `nbAssocies`, `bureau` (utiles au cabinet). Renvoyer ces champs en plus sur chaque lead (`delai`, `nb_associes`, `a_bureau`).
- **`src/routes/_authenticated.marketplace.tsx` → `LeadCard`** : ajouter une ligne avec une icône `CalendarClock` (lucide) pour afficher « Démarrage : {delai} » dans la grille d'infos, si présent.

## 2. Ne JAMAIS divulguer les infos internes au partenaire (même après déblocage)

Champs à garder strictement internes (visibles uniquement dans l'admin) :
- `logo` (a un logo ?)
- `siteWeb` (a un site ?)
- `publicite` (fait de la pub ?)
- `upsell_logo`, `upsell_logo_at`, `upsell_site`, `upsell_site_at` (réponses upsell)

Aujourd'hui la RPC `unlock_lead` renvoie `to_jsonb(prospects.*)` entier — donc le `raw_payload` complet (incluant logo/site/publicité) part vers le client partenaire, même si l'UI n'affiche pas ces champs. Risque de fuite via DevTools.

**Correction** : dans `src/lib/marketplace.functions.ts` :
- **`unlockLead.handler`** : avant de renvoyer `result.prospect`, garder uniquement la liste blanche suivante (les seuls champs autorisés côté partenaire débloqué) :
  - `full_name`, `email`, `phone`, `company_name`
  - `message`, `service`, `city`, `legal_form`, `budget`, `audience`
  - `delai` (extrait du `raw_payload`)
  - Plus aucun autre champ, et **jamais** `raw_payload` brut.
- **`myUnlockedLeads.handler`** : appliquer le même filtre sur les prospects renvoyés. Mettre à jour le type `UnlockedItem` côté UI en conséquence.

## 3. Capacité d'un lead : 5 places au lieu de 6

- **Migration DB** : `CREATE OR REPLACE FUNCTION public.publish_prospect_as_lead(...)` avec `_max_unlocks integer DEFAULT 5` (et le clamp `LEAST(_max_unlocks, 20)` inchangé). Ne pas toucher aux publications déjà existantes — seules les nouvelles publications utiliseront 5.
- **`src/lib/marketplace.functions.ts`** : `publishProspect` → `max_unlocks: z.number().int().min(1).max(20).default(5)`.
- **`src/routes/_authenticated.admin.tsx`** : remplacer `max_unlocks: 6` par `max_unlocks: 5` dans l'appel `publishFn`.

Les leads déjà publiés à 6 places resteront à 6 (aucun rétro-actif). Si vous souhaitez aussi les ramener à 5, dites-le et j'ajoute un `UPDATE lead_publications SET max_unlocks = 5 WHERE max_unlocks = 6 AND unlock_count <= 5;` à la migration.

## Détails techniques

- Aucune nouvelle colonne ; on lit `raw_payload->>delai` côté serveur uniquement.
- Aucune modification des policies RLS — tout reste centralisé dans les server functions admin-side (`supabaseAdmin`).
- L'admin (`_authenticated.admin.tsx`) voit déjà tous les champs `raw_payload` via `PROSPECT_FIELD_LABELS`, donc rien à changer côté admin pour la visibilité interne.
