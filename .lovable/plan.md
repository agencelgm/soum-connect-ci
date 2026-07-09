## Objectif
Deux mécanismes complémentaires :
1. **Self-service** — tout utilisateur (partenaire, agent, admin) peut cliquer « Mot de passe oublié » sur la page de connexion et recevoir un email.
2. **Admin** — l'équipe LGM peut réinitialiser le mot de passe d'un partenaire depuis l'admin, sans passer par l'email.

## 1. Self-service « Mot de passe oublié »

### Sur `/connexion`
- Ajouter un lien **« Mot de passe oublié ? »** sous le champ mot de passe.
- Nouvelle route publique **`/mot-de-passe-oublie`** :
  - Champ email + bouton « Envoyer le lien »
  - Appelle `supabase.auth.resetPasswordForEmail(email, { redirectTo: ${window.location.origin}/reinitialiser-mot-de-passe })`
  - Message de confirmation neutre (« Si un compte existe avec cet email, un lien vient d'être envoyé ») — pas de fuite d'information.

### Nouvelle route publique `/reinitialiser-mot-de-passe`
- Détecte le token `type=recovery` dans l'URL (Supabase pose une session temporaire).
- Formulaire : nouveau mot de passe + confirmation (10 caractères min, comme la page existante `/changer-mot-de-passe`).
- Appelle `supabase.auth.updateUser({ password })`.
- Après succès : toast + redirection vers `/marketplace` ou `/admin` selon le rôle (réutiliser la logique de `changer-mot-de-passe.tsx`).
- Route **publique** (pas sous `_authenticated`), noindex.

### Email de réinitialisation
Le projet a déjà l'infrastructure d'emails auth Lovable en place (Meta Pixel, GHL, etc. configurés). Je vérifierai que le template **« Reset password »** existe ; sinon j'appelle `scaffold_auth_email_templates` pour générer les 6 templates auth avec la charte du site (bleu primaire, Poppins/Inter).

## 2. Reset admin d'un partenaire

### Dans l'admin (`_authenticated.admin.tsx`, panneau Partenaires)
- Sur chaque carte partenaire, ajouter un bouton **« Réinitialiser mot de passe »** (dans le menu d'actions à côté de « Suspendre », « Supprimer », etc.).
- Deux options proposées via un petit dialog :
  - **Option A — Envoyer un email de réinitialisation** : appelle une nouvelle server fn `sendPasswordResetForPartner({ partnerId })` qui utilise `supabaseAdmin.auth.admin.generateLink({ type: 'recovery', email })` puis envoie l'email (via l'infra auth existante). Aucun mot de passe temporaire à communiquer.
  - **Option B — Définir un mot de passe temporaire** : génère un mot de passe aléatoire (12 caractères), le pousse via `supabaseAdmin.auth.admin.updateUserById(userId, { password })`, remet le flag `must_change_password = true` sur la ligne `partners`, et affiche le mot de passe **une seule fois** dans un dialog à copier. À la prochaine connexion, le partenaire est redirigé vers `/changer-mot-de-passe` (logique déjà en place dans `_authenticated.tsx`).

### Sécurité (côté server fn)
Nouvelle fonction `src/lib/partners.functions.ts` :
```ts
adminResetPartnerPassword({ partnerId, mode: "email" | "temporary" })
```
- `.middleware([requireSupabaseAuth])`
- Vérifie `has_role(userId, 'admin')` **OU** `has_role(userId, 'agent')` (les deux rôles staff peuvent le faire — cohérent avec les autres actions admin du projet).
- Charge `supabaseAdmin` **dans le handler** (`await import('@/integrations/supabase/client.server')`).
- Récupère l'email du partenaire, exécute l'action Supabase Admin.
- Journalise (console.log server-side) pour audit léger.
- Retourne `{ mode, temporaryPassword? }`.

### Interdictions
- Ne **pas** permettre à un agent/admin de reset le mot de passe d'un **autre membre staff** via cet endpoint (protection contre l'escalade latérale). Un admin doit passer par le self-service ou un autre admin via Supabase directement. Vérification : refuser si la cible a `admin` ou `agent` dans `user_roles`.

## 3. Éléments hors périmètre
- Pas de refonte de `/changer-mot-de-passe` (déjà OK pour le flow first-login).
- Pas de 2FA.
- Pas de changement de la table `user_roles` ni de la RLS.
- Pas d'historique visible des resets (juste logs serveur pour l'instant).

## Fichiers touchés
- **Créés** : `src/routes/mot-de-passe-oublie.tsx`, `src/routes/reinitialiser-mot-de-passe.tsx`
- **Modifiés** :
  - `src/routes/connexion.tsx` (ajout du lien)
  - `src/lib/partners.functions.ts` (nouvelle server fn)
  - `src/routes/_authenticated.admin.tsx` (bouton + dialog dans le panneau Partenaires)
- **Éventuellement** : scaffold des templates auth si manquants.

## Question ouverte
Préfères-tu que le bouton admin propose **les deux options** (email + mot de passe temporaire), **seulement l'email** (plus sûr), ou **seulement le mot de passe temporaire** (plus pratique quand le partenaire n'a plus accès à son email) ? Par défaut je propose **les deux**, avec l'email en option recommandée.
