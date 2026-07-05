## Objectif
Après l'inscription, obliger chaque nouveau cabinet à regarder une **vidéo tutorielle jusqu'à la fin** avant de pouvoir naviguer dans l'espace partenaire. Tracker côté serveur si la vidéo a été vue, l'afficher dans le back-office admin, et refuser (par défaut) l'approbation d'un cabinet qui ne l'a pas vue.

---

## 1. Asset vidéo
Uploader la vidéo fournie via `lovable-assets` :
```
lovable-assets create --file /mnt/user-uploads/01KV83NQEBH4Y8VNCB3SPCD83Z_2.mp4 \
  --filename tutoriel-partenaire.mp4 \
  > src/assets/tutoriel-partenaire.mp4.asset.json
```
Import : `import tutoVideo from "@/assets/tutoriel-partenaire.mp4.asset.json";` → `tutoVideo.url`.

## 2. Base de données (migration)
Ajouter à `public.partners` :
- `tutorial_watched_at TIMESTAMPTZ` — timestamp de première vue complète.
- `tutorial_max_progress REAL` — plus grand pourcentage atteint (0–1), utile pour distinguer "n'a pas commencé" vs "a abandonné à 60 %".

Le champ est renvoyé automatiquement par `getMyPartner` et `listPartners` (`select("*")`).

## 3. Server fn — `markTutorialProgress`
Dans `src/lib/partners.functions.ts` (middleware `requireSupabaseAuth`) :
- Input : `{ progress: number (0..1), completed: boolean }`
- Résout `partnerId` du user (owner ou membre).
- Met à jour `tutorial_max_progress = GREATEST(existant, progress)`.
- Si `completed` : set `tutorial_watched_at = now()` (idempotent — ne le remplace pas s'il existe déjà).
- Retourne `{ ok, watched_at }`.

Anti-fraude simple : on n'écrit `completed` que si `progress >= 0.95` côté serveur.

## 4. Nouvelle page bloquante — `/tutoriel-partenaire`
Route `src/routes/_authenticated.tutoriel-partenaire.tsx` (auth requise, `noindex`).

**Contenu** :
- Titre : *"Avant de commencer — regardez ce tutoriel"*
- Bloc rouge d'avertissement : *"Cette vidéo est obligatoire. Sans visionnage complet, votre compte ne sera pas approuvé."*
- Lecteur vidéo `<video controls playsInline>` (pas d'autoplay).
- **Contrôles anti-triche** :
  - `controlsList="nodownload noplaybackrate"`
  - `onSeeking` : si l'utilisateur essaie d'avancer au-delà de `maxWatched + 2 s`, on remet le curseur à `maxWatched` (revoir en arrière autorisé).
  - `onTimeUpdate` : suit `maxWatched`, envoie `markTutorialProgress` toutes les 15 s (throttle) sans bloquer l'UI.
  - `onEnded` : appelle `markTutorialProgress({ progress: 1, completed: true })` puis affiche un bouton **"J'ai compris — accéder à mon espace"** qui redirige vers `/espace-partenaire`.
- **Barre latérale info** (à côté du player) :
  - *"Votre compte est en attente d'approbation."*
  - *"Délai habituel : sous 24 h ouvrées."*
  - *"Horaires : Lundi au Vendredi, 9 h – 17 h (heure d'Abidjan)."*
  - Bouton **WhatsApp** vers le +225 07 98 17 23 39 (via `whatsappSupportUrl`) : *"Besoin d'aide ? Contactez-nous"*
  - Numéro affiché en clair : `+225 07 98 17 23 39` (cliquable `tel:`).
- **Étapes visuelles** en dessous du player : `Étape 1 · Regardez la vidéo`, `Étape 2 · Nous validons votre compte sous 24 h`, `Étape 3 · Débloquez vos premiers prospects`.

## 5. Redirection forcée (gate) — `src/routes/_authenticated.tsx`
Ajouter au `AuthLayout`, avant `<Outlet />` :
- Si `!isStaff && me?.partner?.status === "pending_review" && !me.partner.tutorial_watched_at` **et** `pathname !== "/tutoriel-partenaire"` et `pathname !== "/changer-mot-de-passe"` → `navigate({ to: "/tutoriel-partenaire", replace: true })`.
- Le `PendingApprovalBanner` reste masqué sur `/tutoriel-partenaire` (l'info d'attente est déjà dans la sidebar de cette page) pour éviter la redondance.

Résultat : un cabinet fraîchement inscrit ne peut ouvrir aucune autre page tant qu'il n'a pas terminé la vidéo. Après visionnage, il accède librement à toutes les pages (marketplace visible mais bouton "Approbation requise" déjà en place).

## 6. Inscription — `src/routes/inscription-partenaire.tsx`
- Message succès inchangé, mais **redirection vers `/tutoriel-partenaire`** au lieu de `/espace-partenaire`.
- Ajouter dans le pavé "Documents à prévoir" une ligne : *"À la fin de l'inscription, vous devrez visionner une courte vidéo tutorielle avant d'accéder à votre espace."*

## 7. Admin — visibilité et garde-fou
Dans `src/routes/_authenticated.admin.tsx` → `PartnerCard` :

**Sur les cartes `pending_review`** :
- Badge à côté du nom du cabinet :
  - ✅ vert *"Vidéo vue"* + date au survol, ou
  - ⏳ jaune *"Vidéo commencée (X %)"* si `tutorial_max_progress > 0`, ou
  - ⛔ rouge *"Vidéo non vue"* si aucune progression.
- Bouton **"Approuver (+30 crédits)"** : si `tutorial_watched_at` est null, ouvrir une `Dialog` de confirmation :
  > *"Ce cabinet n'a pas terminé la vidéo tutorielle (progression : X %). Voulez-vous vraiment l'approuver ?"* — [Annuler] / [Approuver quand même]
- Filtre rapide au-dessus de l'onglet "En attente" : `Tous / Vidéo vue / Vidéo non vue` — pour ne traiter que les inscriptions "sérieuses".

Pas de blocage dur côté serveur : l'admin garde le dernier mot (utile pour partenaires historiques). L'UI oriente le comportement par défaut.

## 8. Fichiers touchés
- Nouveau : `src/assets/tutoriel-partenaire.mp4.asset.json`
- Nouveau : `src/routes/_authenticated.tutoriel-partenaire.tsx`
- Migration DB : `tutorial_watched_at`, `tutorial_max_progress`
- `src/lib/partners.functions.ts` : `markTutorialProgress`
- `src/routes/_authenticated.tsx` : gate de redirection
- `src/routes/inscription-partenaire.tsx` : redirection + copy
- `src/routes/_authenticated.admin.tsx` : badge vidéo + confirmation avant approbation + filtre

---

## Résultat attendu
- Nouveau partenaire → écran vidéo obligatoire dès la fin de l'inscription, avec horaires, numéro WhatsApp et étapes claires.
- Impossible d'accéder à la marketplace / recharger / espace-partenaire tant que la vidéo n'est pas terminée.
- Admin voit d'un coup d'œil qui a fini la vidéo, filtre les inscriptions sérieuses et est averti s'il tente d'approuver quelqu'un qui n'a pas fini.

---

## Question rapide
Un seul point à confirmer :
- **Doit-on bloquer aussi l'inscription en équipe** (les membres ajoutés par le propriétaire du cabinet doivent-ils regarder la vidéo, ou seulement le propriétaire) ? Par défaut je gate uniquement le propriétaire (le champ est sur `partners`, pas sur `partner_members`) — les membres ajoutés en interne héritent du statut du cabinet.
