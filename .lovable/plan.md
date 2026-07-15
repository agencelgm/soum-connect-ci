# Académie LGM — Vidéos formation partenaires

Créer une section publique de formation à la vente, avec URLs partageables (email/WhatsApp) et suivi de progression pour les partenaires connectés.

## Ce qu'on construit

**Structure des URLs**
- `/academie` — page index listant tous les modules et vidéos
- `/academie/$module/$slug` — page dédiée à une vidéo (partageable)

**Vidéos au lancement** (dans le module "vente")
1. `/academie/vente/comprendre-soumission-comptable` — la vidéo obligatoire déjà uploadée (`tutoriel-partenaire.mp4`)
2. `/academie/vente/prospect-vs-client` — la nouvelle vidéo (upload en cours via cet échange)

L'ordre affiché correspond à un champ `order` dans la config → facile à réorganiser plus tard sans toucher aux URLs.

## Accès et suivi

- **Pages publiques** : n'importe qui avec le lien peut regarder (partage email/WhatsApp sans friction). Pas de login requis.
- **Partenaire connecté** : progression enregistrée automatiquement (comme sur `/tutoriel-partenaire`). Chaque vidéo affiche une pastille "✓ Vu" sur l'index quand terminée.
- **Non connecté** : bannière discrète invitant à se connecter pour suivre sa progression, mais lecture libre.
- **SEO** : pages publiques indexables avec `head()` propre (title, description, og:image basée sur une miniature). L'index `/academie` linké depuis le footer et l'AppShell partenaire.

## Intégration avec le tutoriel obligatoire existant

- La page `/tutoriel-partenaire` reste inchangée (elle bloque l'onboarding tant que la vidéo n°1 n'est pas vue).
- La vidéo n°1 de l'Académie est **la même** que celle du tutoriel obligatoire → un partenaire qui a fini le tutoriel voit la vidéo 1 marquée "✓ Vu" dans l'Académie (partage la colonne `tutorial_watched_at` / `tutorial_max_progress` pour cette vidéo précisément).
- Les vidéos suivantes (n°2+) ont leur propre suivi dans une nouvelle table `partner_video_progress`.
- Sur `/tutoriel-partenaire`, quand la vidéo est terminée, un encart "Continuer votre formation" propose la vidéo n°2 de l'Académie.

## Détails techniques

**Fichiers créés**
- `src/lib/academie-data.ts` — config des modules et vidéos (ordre, slug, titre, description, asset video, durée, transcript optionnel)
- `src/routes/academie.tsx` — page index (grille de cartes par module)
- `src/routes/academie.$module.$slug.tsx` — page vidéo individuelle avec lecteur, description, boutons partage (email + WhatsApp), progression, navigation vidéo précédente/suivante
- `src/lib/academie.functions.ts` — server fns `getMyVideoProgress` et `markVideoProgress` (utilise `requireSupabaseAuth`, no-op si non authentifié)
- `src/assets/academie/prospect-vs-client.mp4.asset.json` — pointer CDN pour la nouvelle vidéo uploadée

**Migration DB**
- Nouvelle table `partner_video_progress` : `partner_id`, `video_slug`, `max_progress` (0-1), `completed_at`, timestamps.
- RLS : partenaires lisent/écrivent leurs propres lignes ; staff lit tout.
- GRANT SELECT/INSERT/UPDATE à `authenticated`, ALL à `service_role`.

**Composants**
- `src/components/academie/VideoPlayer.tsx` — lecteur réutilisable (extrait de la logique existante de `/tutoriel-partenaire` : anti-avance, tracking throttlé 15s, callback `onCompleted`)
- `src/components/academie/ShareButtons.tsx` — boutons "Partager par WhatsApp" et "Copier le lien"
- Lien "Académie LGM" ajouté dans `AppShell` (nav partenaire) et dans le footer public

**SEO**
- Chaque page vidéo : `head()` avec title unique, description ~150 chars, og:title, og:description, og:type="video.other", og:video pointant vers l'asset CDN
- Ajout de `/academie` et de chaque URL vidéo au `sitemap.xml`
- BreadcrumbList schema JSON-LD : Accueil > Académie > [Module] > [Vidéo]
- Bloc "En bref" en HTML statique sur chaque page vidéo (résumé 40-60 mots pour AEO)

**Partage**
- Bouton WhatsApp : `wa.me/?text=` avec le titre + URL absolue
- Bouton "Copier le lien" avec toast de confirmation
- Bouton "Partager par email" : `mailto:?subject=&body=`

## À faire plus tard (hors scope de ce plan)
- Interface admin pour ajouter/réordonner les vidéos sans passer par le code
- Certificats de fin de module
- Quiz de validation entre vidéos
- Modules additionnels (fiscalité, gestion cabinet, etc.)
