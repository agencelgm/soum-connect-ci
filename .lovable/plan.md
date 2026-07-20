
# Growth Job — emails de vente hebdomadaires aux partenaires

## Ce qui change vs plan précédent

- **Cadence** : tous les 2 jours (lundi, mercredi, vendredi = 3 envois/semaine), pas 7 jours d'affilée.
- **Vocabulaire** : jamais "crédits". Toujours "prospects". Ex. "10 000 FCFA = 50 prospects qualifiés dans votre pipeline".
- **Angle systématique** : comparaison **vs pub Facebook / Instagram** (coût par lead, qualité, effort).
- **Régénération hebdomadaire** : chaque **lundi 06h Abidjan**, un job génère 3 nouveaux emails de vente (via Lovable AI Gateway, modèle `google/gemini-2.5-flash`), remplace ceux de la semaine précédente, et planifie les envois lundi / mercredi / vendredi à 09h.
- **Pas d'accumulation** : les anciens brouillons sont supprimés à chaque nouvelle génération. Le journal `email_send_log` garde l'historique des envois réels.
- Correction : "si vous fermez" → "si vous signez".

## Cadre créatif imposé au générateur (system prompt)

Chaque email généré doit respecter :

- **Ton** : direct, chaleureux, professionnel, français Côte d'Ivoire (tutoiement/vouvoiement neutre, éviter argot).
- **Longueur** : 120-180 mots, 1 seul CTA.
- **Interdits** : le mot "crédit(s)", "SAS", "SASU", "auto-entrepreneur", promesses de résultats, superlatifs creux.
- **Obligatoire** : au moins **1 comparaison chiffrée avec la pub Facebook/Instagram**, expression du prix en **prospects** ("50 prospects pour 10 000 FCFA").
- **Rotation d'angles sur la semaine** : lundi = comparaison directe FB Ads, mercredi = math du ROI, vendredi = urgence / volume marketplace live.
- **Variables injectables** : `{prénom}`, `{nb_prospects_semaine}` (7 j glissants), `{ville_principale_prospect}`.

## Grille tarifaire à répéter dans les emails

- **10 000 FCFA = 50 prospects qualifiés** (200 FCFA / prospect)
- **25 000 FCFA = 125 prospects qualifiés** (200 FCFA / prospect, meilleur volume)
- **50 000 FCFA = prospects illimités pendant 30 jours** + accès prioritaire 3h sur chaque nouveau prospect

## Comparaison Facebook/Instagram (à décliner)

Chiffres de référence à passer au générateur (issus de la moyenne observée en CI sur services comptables B2B) :
- Pub Facebook lead ad : **1 500 à 3 000 FCFA par formulaire rempli**, qualité variable (curieux, doublons, faux numéros).
- Sur Soumission Comptable : **200 FCFA par prospect qualifié**, déjà filtré (service précisé, budget déclaré, zone confirmée), plafonné à 5 cabinets.
- Traduction : **1 prospect Soumission Comptable = 7 à 15 leads Facebook** au même prix.

## Exemple généré (à titre indicatif — le job en régénère de nouveaux chaque lundi)

### Lundi (angle FB Ads)

**Objet :** 50 prospects pour le prix d'une pub Facebook ratée
**Preview :** 10 000 FCFA sur Meta = 5 formulaires. Ici = 50 prospects qualifiés.

Bonjour {prénom},

Vous avez déjà lancé une pub Facebook pour votre cabinet ? Alors vous savez : **10 000 FCFA sur Meta, c'est 3 à 6 formulaires**, souvent des curieux, des mauvais numéros, ou des gens hors zone.

Sur Soumission Comptable, ces **mêmes 10 000 FCFA vous donnent 50 prospects qualifiés** : service précisé, budget déclaré, ville confirmée. Chaque prospect est plafonné à 5 cabinets — pas 500 comme sur Meta.

Ça fait **200 FCFA par prospect qualifié**. Le meilleur ratio du marché à Abidjan aujourd'hui.

[Recharger mon compte →]

À mercredi,
L'équipe Soumission Comptable

### Mercredi (angle ROI)

**Objet :** Le calcul qu'un cabinet devrait faire avant de payer une pub
**Preview :** Un seul dossier signé rembourse 125 prospects.

Bonjour {prénom},

Petit calcul honnête.

Un dossier de création d'entreprise que vous signez = **environ 150 000 FCFA**. Un client de comptabilité mensuelle = **60 000 à 100 000 FCFA / mois**.

**125 prospects qualifiés coûtent 25 000 FCFA.** Il vous suffit d'en convertir **1 seul sur 125** pour être largement rentable. À titre de comparaison, une campagne Facebook au même budget vous donnerait 10 à 15 formulaires — dont peut-être 1 ou 2 sérieux.

La question n'est plus le coût. C'est combien de rendez-vous vous êtes prêt à passer cette semaine.

[Voir les prospects disponibles →]

### Vendredi (angle urgence/volume)

**Objet :** {nb_prospects_semaine} nouveaux prospects cette semaine sur la marketplace
**Preview :** Chaque prospect = 5 cabinets max. Ensuite verrouillé.

Bonjour {prénom},

**{nb_prospects_semaine} prospects qualifiés** ont été publiés cette semaine sur Soumission Comptable — création d'entreprise, comptabilité, fiscalité, domiciliation, dans toutes les zones d'Abidjan et intérieur.

Chaque prospect est réservé à **5 cabinets maximum**. Une fois complet, il disparaît de la marketplace.

À 200 FCFA le prospect qualifié (vs 1 500 à 3 000 FCFA sur Facebook), le week-end est le bon moment pour recharger et attaquer lundi avec un pipeline plein.

[Recharger mon compte →]

## Architecture technique

### 1. Nouvelle table `growth_email_batches`

```sql
CREATE TABLE public.growth_email_batches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  week_start date NOT NULL,           -- lundi de la semaine (Africa/Abidjan)
  slot text NOT NULL CHECK (slot IN ('monday','wednesday','friday')),
  subject text NOT NULL,
  preview text NOT NULL,
  body_markdown text NOT NULL,        -- généré par IA, transformé en HTML au send
  cta_label text NOT NULL,
  cta_url text NOT NULL,
  scheduled_for timestamptz NOT NULL,
  sent_at timestamptz,
  generated_by text NOT NULL DEFAULT 'gemini-2.5-flash',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (week_start, slot)
);
```

RLS activée, `GRANT ALL … TO service_role`, `GRANT SELECT … TO authenticated` pour prévisualisation admin.

### 2. Nouvelle table `growth_email_sends`

Idempotence par partenaire × batch (évite double envoi).

```sql
CREATE TABLE public.growth_email_sends (
  batch_id uuid NOT NULL REFERENCES growth_email_batches(id) ON DELETE CASCADE,
  partner_id uuid NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  sent_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (batch_id, partner_id)
);
```

RLS + `GRANT ALL … TO service_role` uniquement.

### 3. Template email `growth-sales-email.tsx`

Un seul template paramétré `{subject, preview, bodyMarkdown, ctaLabel, ctaUrl, partnerFirstName, isPaused, whatsappUrl}`. Rendu React Email cohérent avec la charte existante (footer unsubscribe automatique).

Enregistré dans `src/lib/email-templates/registry.ts`.

### 4. Cron **lundi 06h Abidjan** — `generate-growth-emails.ts`

Fichier : `src/routes/api/public/hooks/generate-growth-emails.ts`.

- Supprime les batches de `growth_email_batches` dont `week_start < current_week AND sent_at IS NULL` (nettoyage des non-envoyés). Les envoyés restent pour audit.
- Appelle Lovable AI Gateway (`google/gemini-2.5-flash`, gratuit jusqu'à 2026-10-13) avec :
  - le system prompt (règles ci-dessus)
  - la grille tarifaire, les chiffres FB Ads, `{nb_prospects_semaine}` calculé live
  - la demande : générer 3 emails JSON `{monday, wednesday, friday: {subject, preview, body, cta_label, cta_url}}`
- Insère 3 lignes dans `growth_email_batches` avec `scheduled_for` = lundi 09h, mercredi 09h, vendredi 09h Abidjan.

### 5. Cron **quotidien 09h Abidjan** — `send-growth-emails.ts`

- Récupère les batches où `sent_at IS NULL AND scheduled_for <= now()`.
- Pour chaque partenaire éligible (`status IN ('approved','paused')`, `deleted_at IS NULL`, `email_bounced_at IS NULL`, pas déjà présent dans `growth_email_sends` pour ce batch) : envoi via `sendTransactionalServer` avec `idempotencyKey = growth:{batch_id}:{partner_id}`.
- Insère la ligne dans `growth_email_sends`.
- Marque `batch.sent_at = now()` une fois la boucle terminée.

Cette séquence est **indépendante** de la règle "1 email prospect / 24h" — c'est de la comm produit, pas transactionnel prospect. Un partenaire peut recevoir dans la même journée un digest prospect + 1 email growth.

### 6. pg_cron

- `generate-growth-emails` : `0 6 * * 1` (lundi 06h UTC = 06h Abidjan)
- `send-growth-emails` : `0 9 * * *` (tous les jours 09h)

Les jours sans batch programmé (mardi/jeudi/samedi/dimanche) : le send tourne mais ne fait rien.

### 7. UI admin (optionnel dans ce lot, à confirmer)

Onglet "Growth emails" dans `/admin` : liste des 3 batches de la semaine avec preview, subject, statut (généré / envoyé), bouton **Régénérer** (relance le job manuellement) et bouton **Modifier** (édition inline avant envoi).

## Fichiers touchés

- Migration SQL (2 tables + RLS + grants)
- `src/lib/email-templates/growth-sales-email.tsx` (nouveau)
- `src/lib/email-templates/registry.ts` (enregistrement)
- `src/routes/api/public/hooks/generate-growth-emails.ts` (nouveau)
- `src/routes/api/public/hooks/send-growth-emails.ts` (nouveau)
- pg_cron : 2 nouvelles entrées
- (optionnel) `src/components/admin/GrowthEmailsPanel.tsx`

## Points à confirmer avant que je code

1. **Le job growth remplace définitivement l'idée de séquence "annonce nouvelle tarification"** — pas de séquence one-shot en plus, c'est le job hebdomadaire qui prend le relais dès lundi prochain (27 juillet 2026). OK ?
2. **UI admin d'aperçu/édition avant envoi** : je l'inclus dans ce lot, ou on lance d'abord le job seul et on ajoute l'UI plus tard ?
3. **Chiffres FB Ads** : je pars sur **1 500 à 3 000 FCFA / lead FB en CI pour services comptables**. Tu confirmes ou tu veux d'autres bornes ?
4. **Cible** : uniquement `approved` + `paused`. Les `pending_review` sont exclus (ils n'ont pas encore accès à la marketplace). OK ?
