## Plan — Aligner le sitemap.xml sur la structure demandée

Le sitemap existe déjà comme route serveur `src/routes/sitemap[.]xml.ts`. Je vais ajuster ses `entries` pour refléter exactement les priorités et `changefreq` du modèle fourni.

### Modifications dans `src/routes/sitemap[.]xml.ts`

Mettre à jour le tableau `entries` (FR) avec les priorités du modèle :

| URL | priority | changefreq |
|---|---|---|
| `/` | 1.0 | weekly |
| `/demande-soumissions` | 0.9 | monthly |
| `/creation-entreprise-cote-divoire` | 0.8 | monthly |
| `/comptabilite-entreprise-abidjan` | 0.8 | monthly |
| `/declaration-fiscale-cote-divoire` | 0.8 | monthly |
| `/domiciliation-entreprise-abidjan` | 0.8 | monthly |
| `/cabinet-comptable-abidjan` | 0.7 | monthly |
| `/creation-entreprise-diaspora-ivoirienne` | 0.7 | monthly |
| `/faq` | 0.7 | monthly |
| `/guides` | 0.6 | monthly |

Garder en plus (déjà présents, utiles, pas dans le modèle mais référencés depuis le site et le `llms.txt`) :
- `/comment-ca-marche` (0.6)
- `/cabinets-comptables-partenaires` (0.7)
- `/a-propos` (0.5)
- Les miroirs anglais `/en`, `/en/get-quotes`, `/en/about`, `/en/company-registration-ivory-coast`, `/en/accounting-firm-abidjan` (priorités secondaires)
- Les guides dynamiques (`/guides/$slug`) — j'ajouterai une entrée par guide en important la liste depuis `src/lib/guides-data.ts`.

### Points à noter

- L'URL `/creation-sarl-abidjan/` figure dans le modèle mais **aucune route ne l'implémente** dans le projet. Je **ne l'ajouterai pas** au sitemap (un sitemap ne doit lister que des URLs réelles 200). À confirmer : voulez-vous que je crée plus tard cette page dédiée SARL, ou la retirer définitivement ?
- Le modèle utilise des trailing slashes (`/faq/`). Les routes TanStack du projet n'en utilisent pas. Je garde **sans** trailing slash pour matcher les vraies URLs servies.
- `robots.txt` pointe déjà sur `https://soumissionscomptables.ci/sitemap.xml` — aucun changement nécessaire.

### Hors périmètre

- Pas de modification de `robots.txt`, `llms.txt`, ni des routes.
- Pas de création de nouvelle page `/creation-sarl-abidjan` (à décider séparément).