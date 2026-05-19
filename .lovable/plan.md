## Objectif

Enrichir le JSON-LD `HowTo` de la page `/creation-entreprise-cote-divoire` pour qu'il corresponde au template fourni : ajouter `description`, `estimatedCost` (XOF, 150 000–500 000), `totalTime` (`P7D`), et un `text` détaillé pour chacune des 5 étapes (le helper actuel ne sérialise que `name`).

## Changements

### 1. `src/lib/seo.ts` — étendre `howToSchema`

Remplacer la signature actuelle par une version plus riche, rétrocompatible :

```ts
type HowToStepInput = string | { name: string; text?: string };
type HowToOptions = {
  description?: string;
  totalTime?: string; // ISO 8601 duration, ex: "P7D"
  estimatedCost?: { currency: string; minValue: string | number; maxValue?: string | number };
};

export function howToSchema(
  name: string,
  steps: HowToStepInput[],
  options: HowToOptions = {}
): Schema {
  const schema: Schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    step: steps.map((s, i) => {
      const base = typeof s === "string" ? { name: s } : s;
      return {
        "@type": "HowToStep",
        position: i + 1,
        name: base.name,
        ...(typeof s !== "string" && s.text ? { text: s.text } : {}),
      };
    }),
  };
  if (options.description) schema.description = options.description;
  if (options.totalTime) schema.totalTime = options.totalTime;
  if (options.estimatedCost) {
    schema.estimatedCost = {
      "@type": "MonetaryAmount",
      currency: options.estimatedCost.currency,
      minValue: String(options.estimatedCost.minValue),
      ...(options.estimatedCost.maxValue !== undefined
        ? { maxValue: String(options.estimatedCost.maxValue) }
        : {}),
    };
  }
  return schema;
}
```

Aucun autre appelant existant n'est cassé (les `string[]` continuent de fonctionner).

### 2. `src/routes/creation-entreprise-cote-divoire.tsx`

Remplacer la constante `STEPS: string[]` par un tableau d'objets `{ name, text }` reprenant exactement le template fourni :

| # | name | text |
|---|---|---|
| 1 | Choisir la forme juridique | Décidez entre SARL, SA ou Entreprise Individuelle selon votre projet, votre capital et le nombre d'associés. |
| 2 | Préparer les documents requis | Rassemblez : CNI, acte de naissance, extrait de casier judiciaire, projet de statuts, justificatif de domicile et justificatif de dépôt du capital. |
| 3 | Déposer le dossier au CEPICI | Soumettez votre dossier en ligne sur e-cepici.ci ou en présentiel au guichet unique. |
| 4 | Obtenir le NCC à la DGI | Enregistrez-vous à la Direction Générale des Impôts pour votre Numéro de Compte Contribuable. |
| 5 | S'immatriculer au RCCM | Finalisez votre immatriculation au Registre du Commerce et du Crédit Mobilier. |

Mettre à jour l'appel `howToSchema(...)` :

```ts
howToSchema(
  "Comment créer une entreprise en Côte d'Ivoire via le CEPICI",
  STEPS,
  {
    description:
      "Guide étape par étape pour créer votre SARL, SA ou Entreprise Individuelle en Côte d'Ivoire via le CEPICI.",
    totalTime: "P7D",
    estimatedCost: { currency: "XOF", minValue: 150000, maxValue: 500000 },
  },
)
```

Adapter le rendu de la liste ordonnée `<ol>` pour afficher `s.name` (au lieu de `s` brut) et, en option, `s.text` en sous-ligne sous chaque étape numérotée — ce qui améliore aussi le contenu visible aligné avec le JSON-LD.

## Hors périmètre

- Pas de modification des autres pages.
- Pas de changement du `name` du HowTo affiché côté SEO de la version EN (la route EN réutilise déjà `FrRoute.options.component` et n'émet pas son propre HowTo).
