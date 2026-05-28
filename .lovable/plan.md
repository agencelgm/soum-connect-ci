## Problème 1 — Erreur "invalid input value for enum credit_tx_type"

La fonction RPC `unlock_lead` insère `'lead_unlock'` dans `credit_transactions.tx_type`, mais l'enum `credit_tx_type` n'a pas cette valeur. Valeurs existantes : `signup_bonus`, `manual_creation_bonus`, `admin_grant`, `admin_revoke`, `unlock_spend`, `recharge`.

**Correction** : migration qui remplace `CREATE OR REPLACE FUNCTION public.unlock_lead(...)` en utilisant `'unlock_spend'` à la place de `'lead_unlock'` (le reste de la fonction reste identique).

## Problème 2 — Carte lead peu attractive

Refonte du composant `LeadCard` dans `src/routes/_authenticated.marketplace.tsx` pour donner envie de débloquer. Aucune modif des données serveur ; uniquement présentation.

Améliorations visuelles :

- **En-tête contrasté** : titre du service plus gros, icône, badge "Nouveau" si publié < 48 h.
- **Délai / urgence** : afficher "Publié il y a X h" (calculé depuis `published_at`) en français + un badge `il reste N places sur 5` avec barre de progression colorée (vert > orange > rouge selon places restantes).
- **Hiérarchie d'info** claire avec icônes Lucide : 📍 ville, 🏢 forme juridique, 💰 budget, 👤 audience (particulier/entreprise), délai.
- **Aperçu du besoin** : `summary` mis en avant dans un bloc cité avec bordure latérale primaire (au lieu d'un petit texte gris).
- **Bouton "Débloquer"** plus visible : taille `lg`, full-width, accent primaire avec icône cadenas, micro-texte sous le bouton : "Coordonnées complètes : nom, email, téléphone, message".
- **Hover** : légère élévation (shadow) pour signaler la cliquabilité.
- Pas d'animation lourde, juste transitions Tailwind.

## Détails techniques

- Migration SQL : `CREATE OR REPLACE FUNCTION public.unlock_lead` avec uniquement le `INSERT INTO credit_transactions ... 'unlock_spend' ...`.
- Helper local `timeAgoFr(published_at)` pour le délai.
- Icônes : `MapPin`, `Building2`, `Wallet`, `Users`, `Lock`, `Sparkles` depuis `lucide-react` (déjà disponible).
- Tokens couleur via les classes sémantiques existantes (`primary`, `muted`, `emerald` reste pour l'état "débloqué").

Aucun changement de logique métier, de RLS, ni de schéma au-delà du `CREATE OR REPLACE` de la RPC.