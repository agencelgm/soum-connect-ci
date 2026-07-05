## Objectif

Remettre les inscriptions partenaires en mode **validation manuelle** : après inscription, le cabinet peut se connecter et naviguer dans son espace, **mais ne peut pas débloquer de leads** tant que l'équipe LGM ne l'a pas approuvé. Un lien WhatsApp permet d'accélérer la validation en envoyant les documents (RCCM, etc.).

---

## 1. Backend — inscription en attente

`**src/lib/partners.functions.ts` → `signupPartner**`

- Remplacer `status: "approved"` par `status: "pending_review"`.
- Supprimer `approved_at` / `approved_by`.
- Supprimer le bonus automatique de 30 crédits (`grantCredits(..., "signup_bonus", ...)`). Les crédits ne seront octroyés qu'à l'approbation manuelle (déjà en place dans `approvePartner`).
- Garder l'attribution du rôle `partner`.
- Garder `emitPartnerEvent(partner, "signup")` (notif équipe), mais **ne plus** émettre `"approved"`.

Aucune migration de schéma : la colonne `status` accepte déjà `pending_review` (utilisée par `approvePartner` / dashboard admin).

---

## 2. Frontend — page d'inscription (`src/routes/inscription-partenaire.tsx`)

- Modifier le bloc d'intro : remplacer *"activation immédiate"* par un texte clair :
  > "Après inscription, un membre de l'équipe LGM vous contactera pour valider votre cabinet. Prévoyez votre **RCCM** et tout justificatif d'activité (attestation fiscale, DFE, carte pro…) pour accélérer la validation."
- Après soumission réussie, ne plus rediriger vers `/marketplace` avec un toast "Bienvenue" — rediriger vers `/espace-partenaire` avec un toast *"Compte créé. En attente de validation."*.

## 3. Frontend — bandeau "En attente d'approbation" partout

Créer `src/components/partner/PendingApprovalBanner.tsx` :

- Affiché en haut de chaque page authentifiée quand `me.partner.status === "pending_review"`.
- Contenu :
  - Titre : *"Compte en cours de validation"*
  - Texte : *"Notre équipe vérifie votre cabinet. Vous pouvez explorer la marketplace, mais le déblocage de prospects sera activé dès approbation."*
  - Deux boutons :
    1. **Bouton WhatsApp** (vert) → `https://wa.me/<numero>?text=<message pré-rempli>` avec `target="_blank"`. Message pré-rempli : *"Bonjour LGM, je viens de créer mon compte partenaire ({cabinet_name}). Voici mes documents pour accélérer la validation."*
    2. Lien secondaire *"Voir les documents demandés"* qui déroule une liste (RCCM, DFE, pièce d'identité du gérant, attestation fiscale, éventuel agrément expert-comptable).

Intégration : injecter le bandeau dans `src/routes/_authenticated.tsx` (au-dessus de `<Outlet />`) pour qu'il apparaisse sur toutes les pages partenaires (marketplace, historique, espace-partenaire, recharger).

## 4. Marketplace — navigation OK, unlock bloqué

`src/routes/_authenticated.marketplace.tsx`

- **Retirer** le blocage total actuel (lignes 83-88 qui affichent *"Votre compte n'est pas encore activé"*).
- Les partenaires `pending_review` voient la liste normalement.
- Sur chaque carte de lead, remplacer le bouton **Débloquer** par un bouton désactivé *"Approbation requise"* + tooltip renvoyant vers le bandeau.
- Garder aussi la garde côté serveur : `unlock_lead` RPC utilise déjà `partner_not_approved` (fonction `unlock_lead` en base), donc pas de risque même si un partenaire contourne le front.

## 5. WhatsApp — numéro configurable

- Ajouter une constante `WHATSAPP_SUPPORT_NUMBER` dans `src/lib/utils.ts` (ou nouveau `src/lib/contact.ts`), valeur en dur pour l'instant : `2250700000000` (à confirmer avec toi — voir question ci-dessous).
- Utilisée par le bandeau et par tout futur point de contact.

## 6. Emails / notifications

- La webhook `emitPartnerEvent(partner, "signup")` existe déjà et envoie vers GHL → suffit pour prévenir l'équipe qu'un nouveau cabinet attend validation.
- Pas de nouveau template email dans ce lot (peut venir dans un second temps).

---

## Fichiers touchés

- `src/lib/partners.functions.ts` (signup → pending_review, retrait crédits auto)
- `src/routes/inscription-partenaire.tsx` (copy + redirect)
- `src/routes/_authenticated.tsx` (montage bandeau)
- `src/routes/_authenticated.marketplace.tsx` (retrait blocage, bouton désactivé)
- `src/components/partner/PendingApprovalBanner.tsx` (nouveau)
- `src/lib/contact.ts` (nouveau, numéro WhatsApp)

## Résultat attendu

- Nouvel inscrit → `status = pending_review`, 0 crédit, redirigé sur `/espace-partenaire`.
- Bandeau jaune visible sur toutes les pages avec bouton WhatsApp direct.
- Marketplace visible mais unlock impossible (front + back).
- Admin valide via `/admin` (flux existant `approvePartner`) → status passe à `approved`, +30 crédits, bandeau disparaît, unlock devient possible.

## Question avant de coder

Quel numéro WhatsApp doit-on utiliser pour le bouton ? le numéro est le +2250798172339