## Objectif

Étoffer le formulaire **/demande-soumissions** (utilisé aussi par /en/get-quotes) en ajoutant **6 nouvelles questions obligatoires**, réparties dans des étapes du parcours multi-étapes existant (Étape 1 → 2 → 3 → …).

## Nouvelles questions à ajouter

### Bloc « Votre projet » (en complément de l'étape 1 actuelle)
1. **Pouvons-nous avoir des détails sur votre projet ?** — zone de texte (déjà présente comme `description`, renommer le libellé et garder le champ).
2. **Combien d'associés avez-vous ?** — champ nombre (`number`, min 1, max 50).
3. **Avez-vous un bureau ?** — Oui / Non (radio).

### Bloc « Votre présence commerciale » (nouvelle étape dédiée)
4. **Avez-vous un logo ?** — Oui / Non (radio).
5. **Avez-vous un site internet ?** — Oui / Non (radio).
6. **Faites-vous de la publicité ?** — Oui / Non (radio).

## Nouvelle structure du parcours (4 étapes au lieu de 3)

```text
Étape 1 / 4 — Votre besoin
  • Service recherché *
  • Statut actuel *
  • Détails du projet * (anciennement « description »)
  • Nombre d'associés *
  • Avez-vous un bureau ? *

Étape 2 / 4 — Votre présence
  • Avez-vous un logo ? *
  • Avez-vous un site internet ? *
  • Faites-vous de la publicité ? *

Étape 3 / 4 — Votre localisation
  • Localisation *
  • Délai *
  • Budget *

Étape 4 / 4 — Vos coordonnées
  • Nom *
  • Téléphone *
  • Email *
  • Nom de l'entreprise *
  • Consentement *
```

La barre de progression passe de 33/66/100 % à 25/50/75/100 %. L'écran de succès reste l'étape 5 (statut interne).

## Changements techniques

Fichier touché : `src/routes/demande-soumissions.tsx` uniquement.

1. **Schéma Zod** — ajouter 5 champs requis :
   - `nbAssocies` : `z.coerce.number().int().min(1).max(50)` avec message FR/EN.
   - `bureau` : `z.enum(["oui","non"])` (libellés UI traduits).
   - `logo` : `z.enum(["oui","non"])`.
   - `siteWeb` : `z.enum(["oui","non"])`.
   - `publicite` : `z.enum(["oui","non"])`.
   - `description` reste, mais devient strictement obligatoire (déjà fait, libellé mis à jour).

2. **COPY FR/EN** — ajouter libellés `lDetails`, `lAssocies`, `lBureau`, `lLogo`, `lSite`, `lPub` + messages d'erreur `errAssocies`, `errBureau`, `errLogo`, `errSite`, `errPub` + nouveaux titres d'étape `s1Title`…`s4Title` et fonction `stepOf` mise à jour pour `n / 4`.

3. **STEP_FIELDS** — passer de 3 à 4 entrées et redistribuer les champs comme ci-dessus.

4. **Composant `Page`** — ajouter le bloc `step === 2` (présence commerciale) et renuméroter les blocs existants (localisation → 3, coordonnées → 4). Mettre à jour les boutons « Retour » / « Suivant », la `progress` (= `step / 4 * 100`), et l'étape 5 (succès).

5. **Composant `RadioYesNo`** (helper local) — petits boutons radio stylés via `<input type="radio">` + libellés Oui/Non (Yes/No), gérés par `register()` de react-hook-form, intégrés dans le composant `Field` existant pour bénéficier de l'étoile rouge et de la bordure d'erreur déjà en place.

6. **Payload envoyé à `/api/public/lead`** — étendre le `body` avec les 5 nouveaux champs. Le schéma serveur `LeadSchema` est strict et inconnu ne traverse pas : il faut **mettre à jour `src/routes/api/public/lead.ts`** pour accepter ces 5 nouveaux champs optionnels côté serveur (longueurs/regex sécurisés), afin de ne rien casser et de transmettre les données au webhook GHL.

## Hors périmètre

- Pas de modification du formulaire d'accueil `LeadFormCard` (reste court, mono-page).
- Pas de modification du formulaire « cabinets partenaires ».
- Pas de changement de design global, ni des étapes de succès et des asides existants.
- Pas de nouveaux fichiers de composants ; tout reste dans `demande-soumissions.tsx` + extension de la route API existante.
