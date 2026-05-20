
## Refonte des sections 10 (article SEO) et 11 (garanties)

**Objectif** : reproduire la mise en page de la référence — gros bloc éditorial avec photos réalistes intercalées dans le texte, suivi d'une bande de garanties avec icônes.

---

### 1. Générer 3 nouvelles photos hyper-réalistes

Génération via `imagegen` en `premium` (qualité photo, pas de peau plastique IA). Toutes en `.jpg`, placées dans `src/assets/home/`.

| Fichier | Sujet | Format |
|---|---|---|
| `seo-meeting.jpg` | Réunion dans un cabinet comptable à Abidjan : un expert-comptable ivoirien (homme ou femme, tenue business sobre) discute avec un client autour d'un bureau, documents et ordinateur portable. Lumière naturelle, photographie éditoriale réaliste, grain de peau visible, pas de rendu IA lisse. | 4:3 (1024×768) |
| `seo-entrepreneur.jpg` | Jeune entrepreneuse ivoirienne en chemise, dans son commerce/atelier à Abidjan, consultant ses comptes sur tablette. Style reportage, lumière du jour, peau texturée naturelle. | 4:3 |
| `seo-diaspora.jpg` | Homme ivoirien en costume travaillant sur un laptop dans un environnement bureau moderne (vue urbaine en fond flou pouvant évoquer la diaspora). Photographie corporate réaliste, pas de skin smoothing. | 4:3 |

Prompts construits explicitement avec : *"documentary editorial photograph, natural skin texture and pores visible, realistic lighting, shot on 50mm, no plastic skin, no AI smoothing, West African / Ivorian subject"*.

---

### 2. Section 10 — Article SEO (zigzag avec photos réelles)

Fichier : `src/routes/index.tsx` (section commentée `====== 10. SEO ARTICLE ======`).

Remplacement des 4 petits placeholders gradient (`bg-gradient-to-br ... Building2/FileCheck/Globe2/ShieldCheck`) par 3 vraies photos intégrées dans un zigzag éditorial :

```text
[ H2 titre + sous-titre italique                                ]

[ ---- paragraphe seoP1 (texte large) ---------------- ] [ photo1 ]
                                                          réunion

[ photo2 ] [ ---- paragraphe seoP2 + liste seoTypes + seoP3 ---- ]
 entrepr.

[ ---- liste seoNeeds (2 col) + seoLocation -- ] [ photo3 ]
                                                  diaspora

[ ---- liste seoAdvantages (pleine largeur) ------------------- ]

[ blockquote mission (centrée, bordure orange) ]
[ seoFinalCta (centré, gras) ]
```

- Photos en `rounded-lg shadow-md`, ratio 4:3, `loading="lazy"`, `alt=""` (décoratif — le texte porte le SEO).
- Grille `md:grid-cols-[1fr_320px]` (et inverse) avec `gap-10`, `items-start`.
- Mobile : photos cachées (`hidden md:block`) pour ne pas alourdir, le texte reste prioritaire.
- Aucune modification de copy : on garde `h.seoP1`, `h.seoP2`, `h.seoTypes`, `h.seoP3`, `h.seoNeeds`, `h.seoLocation`, `h.seoAdvantages`, `h.mission`, `h.seoFinalCta` tels quels.

---

### 3. Section 11 — Garanties (bande orange à fort impact)

Inspirée de la bande orange en bas de la référence.

Fichier : `src/routes/index.tsx` (section `====== 11. TRUST BADGES ======`).

Changements :
- Fond passe de `bg-[#F8FAFC]` à `bg-secondary text-white` (orange marque).
- Icônes : cercle blanc semi-transparent (`bg-white/15`), icône blanche.
- Texte du badge : `text-white font-semibold` au lieu de `text-primary`.
- Padding renforcé : `py-12 md:py-16`.
- Garde la grille `sm:grid-cols-2 lg:grid-cols-4`, garde la copy `h.trustBadges`.

---

### Hors scope

- Pas de changement de contenu rédactionnel (FR conservé tel quel).
- Pas de changement aux 9 autres sections de la page d'accueil.
- Pas de changement aux tokens de design dans `src/styles.css`.
- Pas de version `/en` modifiée dans cette itération (signaler si on doit suivre).

---

### Détails techniques

- Imports ajoutés en tête de `src/routes/index.tsx` :
  - `import seoMeeting from "@/assets/home/seo-meeting.jpg";`
  - `import seoEntrepreneur from "@/assets/home/seo-entrepreneur.jpg";`
  - `import seoDiaspora from "@/assets/home/seo-diaspora.jpg";`
- Icônes `Building2`, `FileCheck`, `Globe2`, `ShieldCheck` retirées de l'usage section 10 (rester importées si utilisées ailleurs — vérifier et nettoyer si plus utilisées du tout, sinon laisser).
- Vérification visuelle après build : ouvrir la home, screenshot des sections 10 et 11 pour confirmer rendu.
