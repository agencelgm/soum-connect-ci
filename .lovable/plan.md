## 1) Badge "Illimité" dans le panneau admin

Fichier : `src/routes/_authenticated.admin.tsx` (onglet Partenaires).

- Sur chaque ligne partenaire, afficher un badge « Illimité » quand `partners.unlimited_until > now()`.
- Style Or/Premium : dégradé ambre `from-amber-400 to-yellow-500`, texte `text-amber-950`, bordure `border-amber-600`, icône `Crown` (lucide-react), pastille compacte `rounded-full`, à côté du nom du cabinet.
- Title tooltip natif : « Illimité jusqu'au {date FR} ».
- Aucun changement en base ni sur l'espace partenaire.

## 2) Événements Lead Facebook sur les nouvelles pages

Constat après lecture du code :
- `BusinessPlanLeadForm` et `FinancingLeadForm` appellent déjà `trackMetaConversion("Lead", …)` (Pixel navigateur + CAPI serveur avec `eventID` déduplication).
- Les 3 pages du tunnel upsell (`/offre-logo`, `/offre-site-internet`, `/offre-gestion-marketing`) et les 2 pages de merci (`/merci-demande-business-plan`, `/merci-demande-financement`) ne déclenchent aucun événement Meta.

Actions :

a. **Vérifier le signal existant** — reproduire une soumission Business Plan et Financement, contrôler dans les logs réseau : appel `fbq('track','Lead')` + POST `/api/public/meta-capi` renvoyant `ok`. Si `META_CAPI_ACCESS_TOKEN` ou le pixel ID ne sont pas configurés côté serveur, corriger le handler `src/routes/api/public/meta-capi.ts`. C'est probablement la cause du « Lead pas reçu » côté Facebook.

b. **Ajouter les événements manquants sur le tunnel upsell**. Chaque étape est une intention forte, donc on envoie un événement `Lead` supplémentaire avec `content_category` distinct pour segmenter dans Ads Manager :
   - `/offre-logo` : au clic sur « Oui, je veux mon logo » → `Lead` `{ content_name: "Upsell Logo", content_category: "upsell_logo" }`.
   - `/offre-site-internet` : au clic sur « Oui, je veux mon site » → `Lead` `{ content_name: "Upsell Site", content_category: "upsell_site" }`.
   - `/offre-gestion-marketing` : au clic sur le CTA WhatsApp « Prendre mon rendez-vous gratuit » → `Lead` `{ content_name: "RDV Marketing", content_category: "upsell_marketing" }`.
   - Récupérer `email`, `mobile`, `nom`, `ville` depuis `sessionStorage` (déjà posés par les formulaires) pour renseigner `user_data` (améliore le matching CAPI).

c. **Événements de confirmation sur les pages merci** (une seule fois par visite via un `useEffect` + garde `sessionStorage`) :
   - `/merci-demande-business-plan` : `Lead` `{ content_category: "business_plan_confirm" }`.
   - `/merci-demande-financement` : `Lead` `{ content_category: "financement_confirm" }`.
   - Garde `sessionStorage.setItem("meta_lead_fired_" + path, "1")` pour éviter les doublons si l'utilisateur recharge.

d. **Vérification finale** : ouvrir chaque page, soumettre, contrôler dans l'onglet Réseau que `fbq` et `/api/public/meta-capi` répondent 200, et dans Meta Events Manager (Test Events) que les événements apparaissent avec la bonne `content_category`.

## Hors périmètre
- Pas de changement au Pixel de tracking des partenaires (`CompleteRegistration`).
- Pas de nouveaux événements standard type `Purchase` (les upsells sont des intentions, pas des achats).
- Aucune modification de logique métier ni de base de données.
