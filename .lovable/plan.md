
## 1. Sidebar plus visible (`src/components/layout/AppShell.tsx`)

Rendre l'email, « Retour au site » et « Déconnexion » mieux mis en valeur (desktop + mobile) :

- **Bloc utilisateur en bas** : carte encadrée avec avatar (initiales), nom/email lisibles (texte `text-foreground`, pas `text-muted-foreground` minuscule).
- **« Retour au site »** : bouton outline pleine largeur avec icône, au-dessus du bloc utilisateur — visuellement séparé de la navigation.
- **« Déconnexion »** : bouton ghost destructive pleine largeur, taille normale (pas en mini-lien).
- Même traitement dans le menu mobile.
- Ajout d'un lien **« Historique »** dans la nav principale (icône `History`).

## 2. Nouvelle route `/historique` (`src/routes/_authenticated.historique.tsx`)

Page avec 3 onglets (`Tabs` shadcn) :

### Onglet « Achats de crédits »
Source : `chariow_payments` filtré par `partner_id` (statut `processed`).
Colonnes : date, pack (`amount_label`), crédits ajoutés, acheteur (email Chariow → mappé sur membre équipe si match), reçu (bouton **Télécharger PDF**).

### Onglet « Crédits utilisés » (déblocages)
Source : `credit_transactions` où `tx_type = 'unlock_spend'`, joint à `lead_publications` + `prospects` + `profiles` (via `created_by`).
Colonnes : date, prospect débloqué (ville/service), membre qui a débloqué (nom + email), crédits dépensés, solde après.

### Onglet « Activité équipe »
Vue unifiée : flux chronologique de toutes les transactions du `partner_id` (achats + déblocages + ajustements admin).
Format ligne : `[date] [Avatar membre] Nom Prénom a [acheté 25 crédits / débloqué le lead "X à Abidjan" / reçu un ajustement] — solde après : N`.
Filtres : par membre (select), par type (achat/utilisation), par période.

## 3. Reçus PDF

Server function `getChariowReceipt({ paymentId })` (`src/lib/receipts.functions.ts`) :
- Protégée par `requireSupabaseAuth`, vérifie que le `partner_id` du paiement correspond au partenaire de l'utilisateur (ou membre équipe).
- Retourne les données nécessaires (entreprise/cabinet, date, pack, montant via `amount_label`, license_code Chariow comme n° de transaction, crédits).

Génération PDF côté **client** avec `jspdf` (déjà léger, compatible) :
- En-tête : logo LGM + « Reçu d'achat de crédits ».
- Bloc client : nom du cabinet, email.
- Tableau : description, quantité, prix (depuis `amount_label`).
- Pied : numéro de transaction Chariow + mention « Paiement traité par Chariow ».
- Nom de fichier : `recu-lgm-{license_code}.pdf`.

Note : on n'a pas le montant numérique exact en base (`amount_label` est texte type « 25 crédits »). Le reçu affichera ce que Chariow nous a transmis. Si tu veux un montant FCFA précis sur le PDF, il faudra mapper les `product_id` Chariow → prix (à confirmer).

## 4. Accès données

Toutes les lectures via `createServerFn` + `requireSupabaseAuth` (RLS déjà OK pour `credit_transactions` et `lead_unlocks`). Pour `chariow_payments`, la policy actuelle est admin-only — il faut **ajouter une policy** « partenaire lit ses propres paiements » :

```sql
CREATE POLICY "Chariow payments: partner own read"
ON public.chariow_payments FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.partners p
    WHERE p.id = chariow_payments.partner_id
      AND (p.profile_id = auth.uid()
           OR EXISTS (SELECT 1 FROM public.partner_members m
                      WHERE m.partner_id = p.id AND m.user_id = auth.uid()))
  )
);
```

## 5. Limites connues à confirmer

- **Attribution membre sur achat Chariow** : on matche par `chariow_payments.email` → `partner_members.email` ou `partners.email`. Si un membre paie avec un autre email, l'attribution affichera juste l'email Chariow.
- **Historique d'utilisation avant aujourd'hui** : `credit_transactions.created_by` est déjà rempli par `unlock_lead()`, donc on a l'historique complet à partir d'aujourd'hui pour les déblocages. Les anciens déblocages (s'il y en a) garderont `created_by`.

## Fichiers touchés

- `src/components/layout/AppShell.tsx` (refonte bas de sidebar + ajout lien Historique)
- `src/routes/_authenticated.historique.tsx` (nouveau)
- `src/lib/history.functions.ts` (nouveau — list achats, list déblocages, activité équipe)
- `src/lib/receipts.functions.ts` (nouveau — données reçu)
- `src/components/historique/ReceiptPdfButton.tsx` (nouveau — génération jsPDF)
- Migration SQL : policy `chariow_payments` lecture partenaire
- `bun add jspdf`
