## Retrait complet de WhatsApp

L'utilisateur demande de retirer **tout** ce qui est lié à WhatsApp du site.

### Fichiers concernés et modifications

1. **src/components/layout/Header.tsx** ✅ — bouton WhatsApp desktop et mobile retirés
2. **src/components/layout/Footer.tsx** ✅ — icône sociale et numéro retirés
3. **src/routes/__root.tsx** ✅ — import et rendu de WhatsAppFab retirés
4. **src/lib/translations.ts** ✅ — clés whatsapp/contactWhatsapp renommées
5. **src/components/home/LeadFormCard.tsx** — champ `whatsapp` → `mobile`, label et placeholder mis à jour
6. **src/components/pages/AboutPage.tsx** — bloc contact WhatsApp retiré
7. **src/routes/demande-soumissions.tsx** — labels, placeholders, validation, aside WhatsApp retirés
8. **src/routes/comment-ca-marche.tsx** — mention WhatsApp dans les étapes retirée
9. **src/routes/cabinets-comptables-partenaires.tsx** — champ `whatsapp` → `mobile`
10. **src/routes/api/public/lead.ts** — champ `whatsapp` → `mobile`
11. **src/components/layout/WhatsAppFab.tsx** — fichier à supprimer

### Changements techniques
- Tous les champs de formulaire `whatsapp` deviennent `mobile` (ou `phone`)
- Les labels passent de "WhatsApp" à "téléphone" / "numéro de téléphone"
- Les liens `wa.me` et la couleur `#25D366` sont supprimés
- Le fichier `WhatsAppFab.tsx` est supprimé
