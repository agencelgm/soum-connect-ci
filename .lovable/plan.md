## Objectifs

1. Plafond officiel **5 entreprises** par prospect (au lieu de 6).
2. Quand 5 atteint : bouton « Débloquer » masqué, message explicite « 5 cabinets ont déjà contacté ce prospect ».
3. Programme **Premium** (clients de l'agence LGM) : avance exclusive de **3h** sur chaque nouveau lead, avant ouverture aux partenaires réguliers.
4. Désignation premium **manuelle** depuis le back-office /admin.
5. Migration des leads existants à `max_unlocks=5` (sans toucher aux unlocks déjà effectués).

---

## 1. Plafond 5 entreprises

- Migration SQL :
  - Mettre à jour `publish_prospect_as_lead` : défaut `_max_unlocks = 5`, borne `LEAST(_max_unlocks, 10)`.
  - `UPDATE lead_publications SET max_unlocks = 5 WHERE max_unlocks > 5 AND unlock_count <= 5;` (les leads déjà à 6 unlocks restent intacts mais deviendront inactifs naturellement).
- `src/lib/marketplace.functions.ts` : `publishProspect` → `max_unlocks.default(5)`, `.max(10)`.
- `src/routes/_authenticated.admin.tsx` : input de publication par défaut 5, label « 5 cabinets max ».

## 2. UI marketplace quand le lead est plein

`src/routes/_authenticated.marketplace.tsx` :

- Afficher tous les leads, y compris ceux où `unlock_count >= max_unlocks`.
- Pour un lead plein non débloqué par le partenaire courant :
  - Carte grisée, badge rouge « Complet — 5/5 cabinets ».
  - Message : « 5 cabinets ont déjà contacté ce prospect. Pour ne plus rater d'opportunités, connectez-vous plus souvent et soyez parmi les premiers. »
  - Pas de bouton « Débloquer ».

## 3. Programme Premium + fenêtre d'avance 3h

### Base de données (migration)

```sql
ALTER TABLE public.partners
  ADD COLUMN IF NOT EXISTS tier text NOT NULL DEFAULT 'regular'
    CHECK (tier IN ('premium','regular'));

ALTER TABLE public.lead_publications
  ADD COLUMN IF NOT EXISTS premium_until timestamptz;

-- Au moment de la publication, premium_until = now() + interval '3 hours'
-- (mis à jour dans publish_prospect_as_lead)
```

Mise à jour de la fonction `publish_prospect_as_lead` pour positionner `premium_until = now() + interval '3 hours'`.

Mise à jour de `unlock_lead` : si `now() < premium_until` ET le partenaire n'est pas premium → `RAISE EXCEPTION 'premium_window_active'`.

### Côté serveur (`marketplace.functions.ts`)

- `listMarketplace` retourne `premium_until` et `partner.tier`.
- Le filtrage de visibilité reste côté UI (les réguliers voient le lead avec compte à rebours, conforme à votre choix).
- Mapping erreur `premium_window_active` → message FR.

### UI marketplace

**Pour un partenaire premium :**

- Badge doré « ⭐ Avance Premium » sur les leads encore dans la fenêtre 3h.
- Bandeau en haut de la marketplace : « Vous êtes client Premium — vous avez 3h d'avance sur chaque nouveau lead. »
- Compte à rebours sur la carte : « Avance exclusive : 2h 47min restantes ».

**Pour un partenaire régulier sur un lead encore en fenêtre premium :**

- Carte avec voile + badge « Réservé clients Premium ».
- Compte à rebours : « Disponible dans 2h 47min ».
- Texte : « Ce prospect est actuellement réservé à nos clients Premium. Devenez Premium pour accéder en avant-première aux prospects. »
- CTA WhatsApp : lien `https://wa.me/<numéro>?text=Bonjour%2C%20je%20fais%20partie%20de%20Soumission%20comptable.%20Je%20voudrais%20savoir%20comment%20devenir%20un%20client%20premium%20avec%20vous.`
- Bouton « Débloquer » désactivé pendant la fenêtre.

> **À confirmer** : quel numéro WhatsApp utiliser pour le lien (celui de LGM/Soumission comptable) ?

### Back-office admin

`src/routes/_authenticated.admin.tsx` (onglet Partenaires) :

- Colonne « Statut » avec badge Premium/Régulier.
- Bouton « Passer Premium » / « Retirer Premium » dans la fiche partenaire.
- Nouvelle server fn `setPartnerTier({ partner_id, tier })` dans `partners.functions.ts` (staff only).

## 4. Fichiers touchés

- `supabase/migrations/<ts>_premium_tier_and_max_5.sql` — colonnes `tier`, `premium_until`, update fonctions RPC, migration max_unlocks.
- `src/lib/marketplace.functions.ts` — défaut 5, exposition `tier` + `premium_until`, mapping erreur.
- `src/lib/partners.functions.ts` — `setPartnerTier`.
- `src/routes/_authenticated.marketplace.tsx` — affichage complet, badges, compte à rebours, CTA WhatsApp, lead plein.
- `src/routes/_authenticated.admin.tsx` — défaut 5, gestion tier partenaire.
- `src/lib/ghl-partners.server.ts` — ajouter `tier` au payload (utile pour segmentation CRM).

## Question ouverte

Quel numéro WhatsApp doit recevoir les demandes de passage en Premium ? +2250798172339