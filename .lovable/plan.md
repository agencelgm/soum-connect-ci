## Vérification FAQPage JSON-LD

Bonne nouvelle : le schéma JSON-LD `FAQPage` est **déjà implémenté** sur toutes les pages concernées via le helper `faqSchema()` de `src/lib/seo.ts` :

| Page | Schéma FAQPage |
|---|---|
| `/faq` | ✅ déjà présent (toutes les FAQ agrégées) |
| `/cabinet-comptable-abidjan` | ✅ |
| `/comptabilite-entreprise-abidjan` | ✅ |
| `/declaration-fiscale-cote-divoire` | ✅ |
| `/domiciliation-entreprise-abidjan` | ✅ |
| `/creation-entreprise-cote-divoire` | ✅ (+ HowTo) |
| `/creation-entreprise-diaspora-ivoirienne` | ✅ |
| `/cabinets-comptables-partenaires` | ❌ manquant (a une FAQ partenaires non sérialisée) |

## Seul changement à faire

Ajouter `faqSchema` sur `/cabinets-comptables-partenaires`, qui contient bien 3 questions/réponses dans `PARTNER_FAQS` mais n'émet pas de JSON-LD.

**Fichier à modifier :** `src/routes/cabinets-comptables-partenaires.tsx`
- Importer `faqSchema` depuis `@/lib/seo`.
- Ajouter `extraSchemas: [faqSchema(PARTNER_FAQS.map(f => ({ question: f.q, answer: f.a })))]` dans le `buildPageHead` du `head()`.
- Déplacer la constante `PARTNER_FAQS` au-dessus du `createFileRoute(...)` (elle est actuellement définie après, mais utilisée dans `head()`).

## Hors périmètre
- Aucun changement aux autres pages : leur FAQPage JSON-LD est déjà conforme à la structure schema.org demandée.
- Pas de nouveau template HowTo à ajouter ici (déjà présent sur la page création d'entreprise).