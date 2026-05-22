
## Objectif

Créer une **deuxième page d'accueil**, jumelle de `/` en structure et conversion, mais dont tout le discours et le SEO/GEO/AEO sont centrés sur **« créer / enregistrer son entreprise en Côte d'Ivoire »** au lieu de « cabinet comptable ». Cible : les entrepreneurs qui cherchent quelqu'un pour faire les démarches CEPICI (RCCM, DFE, IDU, CNPS, statuts, PV, etc.) — pas forcément un comptable.

Important : on garde la page `/` actuelle intacte (mot-clé « cabinet comptable »). La nouvelle page sert d'**entrée parallèle** pour les campagnes et le SEO sur un autre cluster de requêtes.

Note : il existe déjà `/creation-entreprise-cote-divoire`, mais c'est une page **service / SEO informationnelle** (explique le sujet). La nouvelle page est une **landing de conversion** complète, calquée sur l'accueil (hero + formulaire + preuves + témoignages + FAQ + CTA), pas un article.

## URL et mot-clé principal

URL proposée : **`/creer-son-entreprise-cote-divoire`** (FR) + **`/en/start-a-business-ivory-coast`** (EN).

Mot-clé focus FR : « créer son entreprise en Côte d'Ivoire » / « enregistrer son entreprise Abidjan » / « création d'entreprise CEPICI ».
Mots-clés secondaires : RCCM, DFE, IDU, statuts, déclaration CNPS, création SARL, création SARLU, création SA, EI, GIE — démarches administratives, CEPICI, 10 jours, clé en main.

(Si tu préfères une autre URL — ex. `/creation-entreprise-rapide` ou `/enregistrement-entreprise-abidjan` — dis-le, je l'adapte avant de coder.)

## Angle éditorial (ton + promesse)

Inspiré directement des pubs jointes (MZEE, Ivoire Création, King Solutions, Stbo Academy) :

- **H1 type** : « Créez votre entreprise en Côte d'Ivoire en 10 jours — RCCM, DFE, IDU, statuts inclus »
- **Promesse** : on s'occupe de **toutes les démarches CEPICI** à votre place, via un partenaire agréé sélectionné parmi 50+ cabinets.
- **Liste visible dès le hero** (style annonces FB) : RCCM, Compte contribuable, DFE, IDU, Statuts, PV, Annexe fiscale, Déclaration CNPS, Domiciliation.
- **Formes juridiques mises en avant** : SARL, SARLU, SA, EI, GIE (conformes OHADA — pas de SAS/SASU/micro).
- **Différenciateur vs concurrence pub** : au lieu d'un seul prestataire imposé, on compare jusqu'à **5 devis gratuits** de cabinets agréés OECCA-CI / CEPICI en 48 h → meilleur prix + meilleur fit.
- Le mot « comptable » disparaît du hero et reste discret plus bas (« cabinets comptables agréés » comme gage de sérieux).

## Structure de la page (parallèle à l'accueil)

1. **Hero** : H1 + sous-titre + checklist documents (RCCM, DFE, IDU…) + `LeadFormCard` à droite (même composant que l'accueil, service pré-sélectionné = « Création d'entreprise »).
2. **Bandeau preuves** (trust badges horizontaux mobile — déjà optimisé).
3. **Comment ça marche en 3 étapes** : 1) Vous décrivez votre projet · 2) On vous met en relation avec 5 cabinets agréés · 3) Vous recevez devis + accompagnement clé en main.
4. **Ce que vous obtenez** : grille des documents livrés (RCCM, DFE, IDU, statuts, PV, annexe fiscale, CNPS, compte bancaire, domiciliation) — section visuelle, pas un mur de texte.
5. **Formes juridiques disponibles** : cartes SARL · SARLU · SA · EI · GIE avec 1 phrase chacune (qui c'est pour, capital, particularité). Renvoi interne vers `/creation-entreprise-cote-divoire` pour le détail.
6. **Combien ça coûte / délais** : fourchettes indicatives (≈ 75 000 – 200 000 FCFA selon forme), délai 7–15 jours ouvrés. Sans mentir : « les devis exacts viennent des cabinets ».
7. **Cas particuliers** : diaspora (renvoi `/creation-entreprise-diaspora-ivoirienne`) + transformation EI → SARL.
8. **Témoignages** (réutilise les 3 actuels — Léa Goré, Maxime Doudou, Vanessa Tehé — adaptés sur le verbatim « création »).
9. **FAQ** ciblée création : Combien de temps ? Quels documents fournir ? Quelle forme choisir ? Faut-il être en CI ? Quel coût total CEPICI + cabinet ? Différence RCCM / DFE / IDU ?
10. **CTA final** + `MobileCtaBar` réutilisée.

## SEO / GEO / AEO

- `head()` dédié via `buildPageHead` : title ≤ 60, meta desc ≤ 155, canonical propre, hreflang FR↔EN, og:image existante.
- **Schemas JSON-LD** : `Service` (« Création d'entreprise clé en main »), `FAQPage` (les questions du bloc 9), `BreadcrumbList`, `HowTo` (les 3 étapes + délais + fourchette de coût en `estimatedCost` XOF). Tous via les helpers existants de `src/lib/seo.ts`.
- **AEO** : chaque question FAQ formulée en langage naturel + réponse autonome de 2–4 phrases (citable par un LLM sans le reste de la page).
- **GEO** : mentions explicites Abidjan / Côte d'Ivoire / CEPICI / OHADA / OECCA-CI dans H1, intro, FAQ, alt d'images.
- Maillage interne : liens vers `/creation-entreprise-cote-divoire`, `/creation-entreprise-diaspora-ivoirienne`, `/cabinet-comptable-abidjan`, `/demande-soumissions`, guides pertinents (`creer-sarl-cepici`, `sarl-sa-ei-cote-divoire`, `creer-entreprise-ci-depuis-france`).
- Ajout au `sitemap.xml` (FR + EN) et au `route-map` / `page-relations` pour les liens contextuels.

## Contraintes respectées

- 100 % en français côté FR, EN sous `/en/...`.
- Formes juridiques limitées à SARL, SARLU, SA, EI, GIE (OHADA). Jamais SAS/SASU/micro/auto-entrepreneur.
- Aucune image IA — réutilisation des photos Unsplash déjà présentes sur l'accueil + 1 ou 2 photos existantes du projet (pas de nouvelle génération).
- Pas de mention « Supabase » côté UI.

## Fichiers à créer / modifier (détails techniques)

- **Créer** `src/routes/creer-son-entreprise-cote-divoire.tsx` (landing FR, composant qui réutilise au max les sections de `src/routes/index.tsx`).
- **Créer** `src/routes/en/start-a-business-ivory-coast.tsx` (wrapper EN avec `head()` EN, comme les autres pages `/en/*`).
- **Refacto léger** de `src/routes/index.tsx` : extraire en composants partagés (`src/components/home/`) les blocs réutilisés (trust badges, how-it-works, témoignages, FAQ wrapper) pour éviter la duplication. Aucun changement visuel sur `/`.
- **`src/lib/translations.ts`** : ajouter une section `startBusiness` (FR + EN) avec tous les textes de la nouvelle page (hero, étapes, docs livrés, formes, FAQ, CTA).
- **`src/lib/seo.ts`** : rien à changer, les helpers couvrent déjà `Service` / `HowTo` / `FAQPage` / `Breadcrumb`.
- **`src/routes/sitemap[.]xml.ts`** : ajouter les 2 nouvelles URLs.
- **`src/lib/route-map.ts`** et **`src/lib/page-relations.ts`** : enregistrer la nouvelle page + relations entrantes/sortantes.
- **`Header.tsx` / `Footer.tsx`** : pas de changement du menu principal pour ne pas diluer ; la page est destinée aux campagnes + SEO, accessible via footer (lien discret « Créer mon entreprise ») et liens internes contextuels.

## Hors scope (à confirmer si tu veux les inclure)

- Pas de nouveau formulaire dédié — on réutilise `LeadFormCard` avec service pré-sélectionné.
- Pas de nouvelle traduction d'images / photos.
- Pas de modification de l'accueil `/` au-delà de l'extraction de composants partagés (zéro changement visible).
