# Nouveau tunnel après formulaire : vidéo d'abord, boutons verrouillés à 75 %

## Le nouveau parcours

```text
Formulaire rempli (devis, business plan, financement, EN)
      |
      v
/formation-clients  ->  vidéo, boutons cachés jusqu'à 75 % visionné
      |                        \
   "Oui"                        "Non"
      |                          |
  Checkout formation        Offre SITE INTERNET (70 000 FCFA)
  (academielgm.com)              |            \
                              "Oui"           "Non"
                                |               |
                        WhatsApp pré-rempli   Offre ACCOMPAGNEMENT MARKETING
                        « site internet »       |            \
                                             "Oui"           "Non"
                                                |               |
                                          WhatsApp RDV      Page de remerciement
```

Le formulaire partenaire n'est pas touché.

## Ce qui change concrètement

1. **Après n'importe quel formulaire prospect**, on arrive directement sur la page vidéo. Les pages d'offre ne s'affichent plus avant.
   - Formulaire de devis (FR et EN)
   - Formulaire business plan
   - Formulaire dossier de financement

2. **Page vidéo (/formation-clients)**
   - Les deux boutons (« Oui, je veux la formation » / « Non merci ») sont masqués au chargement.
   - Un message remplace les boutons : « Les options apparaîtront pendant la vidéo » avec une barre de progression du visionnage.
   - Les boutons apparaissent dès que 75 % de la vidéo a réellement été regardée. Avancer manuellement la barre de lecture ne débloque pas les boutons (on mesure le temps réellement visionné).
   - Nouvel événement de suivi `video_75` dans Stats formation, en plus de `video_play` et `video_complete`.

3. **« Non » sur la vidéo** → page offre site internet (version FR ou EN selon la langue du formulaire).

4. **« Oui » sur l'offre site internet** → ouverture de WhatsApp avec un message pré-rempli du type :
   « Bonjour, j'aimerais avoir un site internet professionnel à 70 000 FCFA. Veuillez me contacter. »
   Puis passage à l'offre accompagnement marketing.

5. **Offre accompagnement marketing** → inchangée (WhatsApp RDV gratuit si « Oui »), mais elle envoie maintenant vers la page de remerciement finale au lieu de renvoyer vers la vidéo.
   Cela règle aussi les messages WhatsApp peu pertinents : ils venaient des prospects business plan / financement qui passaient par cette page trop tôt dans le tunnel.

6. **Étapes affichées** : vidéo = étape 1 sur 3, site internet = 2 sur 3, marketing = 3 sur 3.

## Détails techniques

- `src/routes/formation-clients.tsx` : suivi du visionnage via `timeupdate` avec cumul du temps réellement lu (détection des sauts), état `unlocked` à 75 %, boutons rendus seulement si `unlocked`, envoi de l'événement `video_75` à `/api/public/funnel-track`. Le « Non » navigue vers `/offre-site-internet` ou `/en/website-offer` selon `sessionStorage.leadLanguage`.
- `MultiStepLeadForm.tsx`, `BusinessPlanLeadForm.tsx`, `FinancingLeadForm.tsx` : redirection vers `/formation-clients` ; on continue d'écrire `leadId`, `leadUser`, `finalThankYouPath`, plus `leadLanguage`.
- `src/components/upsell/OfferPage.tsx` : nouvelle prop optionnelle `whatsappUrl` — si « Oui », ouverture du lien WhatsApp puis navigation vers `nextPath`.
- `src/routes/offre-site-internet.tsx` et `src/routes/en/website-offer.tsx` : passage du message WhatsApp site internet, libellés d'étape 2 sur 3, `nextPath` inchangé.
- `src/routes/offre-gestion-marketing.tsx` : navigation finale vers `sessionStorage.finalThankYouPath` (défaut `/merci`), libellé 3 sur 3.
- `src/hooks/useFormationGate.ts` : conservé — les pages de remerciement redirigent toujours vers la vidéo si `formationChoice` est absent.
- Le suivi Meta (Pixel + CAPI) reste en place à chaque étape, aucun événement supprimé.