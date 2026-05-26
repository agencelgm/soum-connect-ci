## Objectif

Ajouter un champ **`audience`** dans le payload envoyé à GoHighLevel pour distinguer 2 audiences :
- `creation` — prospect qui veut **créer** son entreprise
- `gestion` — prospect qui a **déjà** une entreprise et cherche un cabinet pour la gestion
- `unknown` — non déterminable (qualification manuelle dans GHL)

Architecture **future-proof** : l'audience de chaque guide est déclarée comme métadonnée dans `guides-data.tsx` (champ obligatoire en TypeScript), donc impossible d'ajouter un nouveau guide sans préciser l'audience.

## Portée

Appliqué aux 2 endpoints de phase 1 :
- `POST /api/public/lead`
- `POST /api/public/contact`

L'endpoint `/api/public/lead-upsell` reste inchangé (services annexes).

## Logique de classification

Priorité décroissante dans `inferAudience()` :

1. **`audience_hint` envoyé par le formulaire** (métadonnée de la page d'origine) — source de vérité quand on est sur un guide ou une page taggée
2. **Champ `statut`** du formulaire principal — déclaration explicite de l'utilisateur ("Je veux créer" / "J'ai déjà une entreprise")
3. **`source`** — règles sur les pages non-guide (home, demande-soumissions, créer-son-entreprise, contact)
4. **`service`** choisi — fallback final
5. Sinon → `unknown`

## Détails techniques

### 1. Métadonnée `audience` sur chaque guide

Dans `src/lib/guides-data.tsx`, ajouter au type `Article` :

```ts
/** Audience marketing du guide. Obligatoire — détermine le routing GHL. */
audience: "creation" | "gestion" | "both";
```

Puis remplir pour les ~25 guides existants. Répartition prévue :
- **creation** : creer-sarl-cepici, sarl-sa-ei, creer-entreprise-ci-depuis-france, cepici, entreprise-individuelle-vs-sarl, capital-minimum-sarl-ohada, creer-sa-cote-divoire, erreurs-creation-entreprise-ci, creer-entreprise-ci-canada, cout-creation-entreprise, rccm-cote-divoire, aides-creation-entreprise-ci
- **gestion** : calendrier-fiscal-2026, cout-cabinet-comptable-abidjan, impots-entreprise, choisir-cabinet-comptable-abidjan, tva-cote-divoire-pme, obligations-comptables-sarl-ci, cnps-cote-divoire-employeurs, audit-comptable-obligatoire, domiciliation-entreprise-abidjan, compte-bancaire-entreprise-abidjan, cabinet-comptable-plateau / cocody / angre

Le champ étant requis, **toute future addition échouera le build tant que `audience` n'est pas renseigné** → garde-fou automatique.

### 2. Propagation jusqu'au formulaire

- `ArticleLayout` lit `article.audience` et passe une prop `audienceHint` au `MultiStepLeadForm`
- `MultiStepLeadForm` accepte une prop optionnelle `audienceHint?: "creation" | "gestion" | "both"` et l'ajoute au payload sous le nom `audience_hint`
- Les autres usages du formulaire (home, demande-soumissions, créer-son-entreprise) ne passent pas la prop → `audience_hint` reste `undefined` et `inferAudience` retombe sur les autres règles

### 3. Schémas Zod

Ajouter dans `lead.ts` et `contact.ts` :
```ts
audience_hint: z.enum(["creation", "gestion", "both"]).optional(),
```

### 4. Nouveau fichier `src/lib/audience.ts`

Fonction pure `inferAudience({ audience_hint, statut, source, service })` qui retourne `"creation" | "gestion" | "unknown"`. Logique :
- `audience_hint === "both"` → ne tranche pas, passe à la règle suivante
- `audience_hint === "creation" | "gestion"` → retourne directement
- Sinon parcourt statut → source (via une petite map de préfixes pour les pages non-guide) → service (regex)

Fichier importé seulement par les routes `/api/public/*` (côté serveur). Pas de `.server.ts` car la logique est pure et peut servir aussi en debug.

### 5. Endpoints

Dans `lead.ts` et `contact.ts`, après le `safeParse` réussi :
```ts
const audience = inferAudience({
  audience_hint: parsed.data.audience_hint,
  statut: parsed.data.statut,
  source: parsed.data.source,
  service: parsed.data.service,
});
const payload = { ...parsed.data, audience, tag: "soumissioncomptable", ... };
```

### 6. Commentaire de garde dans `guides-data.tsx`

En tête du fichier, un bref commentaire :
```
// IMPORTANT : chaque nouvel article DOIT déclarer `audience`.
// "creation" = veut créer son entreprise, "gestion" = a déjà une entreprise, "both" = transverse.
// Ce champ est envoyé à GoHighLevel pour router le prospect vers la bonne séquence.
```

## Côté GoHighLevel (à faire ensuite par toi)

Brancher sur le champ `audience` du payload :
- `audience = creation` → ta séquence "Création d'entreprise"
- `audience = gestion` → ta séquence "Gestion comptable"
- `audience = unknown` → tâche de qualification manuelle

## Validation

Après build, je relance des tests webhook avec différents `source` / `audience_hint` / `statut` et je te confirme que `audience` arrive avec la bonne valeur dans chaque cas.
