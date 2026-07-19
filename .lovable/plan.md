## Ce que je constate

Ta capture vient de **Cloud → Emails → Aperçu**, pas d'un email réellement envoyé (`email_send_log` n'a aucun envoi `new-prospect` pour l'instant). Cela explique les deux points :

### 1. « Côte d'Ivoire Leads » dans le From

Le code (`send.ts`, `webhook.ts`, `send.server.ts`) envoie déjà avec `SITE_NAME = "Soumission Comptable"`. Les vrais emails partent donc au bon nom.

Le « Côte d'Ivoire Leads » affiché est le **nom d'affichage du domaine** enregistré au niveau du domaine d'envoi `notify.soumissioncomptable.com` lors du provisionnement. Ce champ n'est **pas dans le code du projet** — il se change uniquement dans **Cloud → Emails → Gérer les domaines → nom d'affichage** (à faire par toi, action manuelle, 30 s).

### 2. Les détails (message / budget / profil) n'apparaissent pas

Le template `new-prospect.tsx` contient bien les blocs conditionnels pour `message`, `budget`, `audience`. Mais l'aperçu du dashboard n'utilise **que le `previewData`** défini dans le template — et celui-ci ne contient actuellement que `partnerFirstName`, `prospectFirstName`, `service`, `city`, `loginUrl`. Résultat : les 3 champs conditionnels restent vides dans l'aperçu.

Les vrais emails envoyés à tes partenaires reçoivent ces champs (déjà branchés dans `notify-partners.server.ts`), donc c'est un problème d'aperçu, pas de production.

## Changement proposé (code)

**`src/lib/email-templates/new-prospect.tsx`** — enrichir le `previewData` :

```ts
previewData: {
  partnerFirstName: 'Marc',
  prospectFirstName: 'Awa',
  service: "Création d'entreprise",
  city: 'Abidjan',
  audience: "Création d'entreprise",
  budget: '150 000 – 300 000 FCFA',
  message:
    "Je souhaite créer une SARL à Abidjan pour lancer mon activité de conseil. J'aimerais un accompagnement complet et un devis rapide.",
  loginUrl: 'https://www.soumissioncomptable.com/connexion',
}
```

Faire la même chose pour `new-prospect-paused.tsx` afin que l'aperçu « partenaires en pause » montre aussi le message + budget + solde crédits.

Aucun changement de logique métier — uniquement les données d'exemple utilisées par la prévisualisation.

## Action manuelle à faire de ton côté

Pour changer le « From » affiché partout (aperçu **et** vrais emails futurs) :

1. Ouvre **Cloud → Emails → Gérer les domaines**
2. Sélectionne `notify.soumissioncomptable.com`
3. Change le champ **Nom d'affichage** de « Côte d'Ivoire Leads » vers **Soumission Comptable**
4. Enregistre

Une fois fait, l'aperçu et tous les nouveaux envois utiliseront « Soumission Comptable ».

## Vérification après implémentation

- Rouvrir l'aperçu du template « Nouveau prospect approuvé » → les blocs Profil, Budget indiqué et « Message du prospect » doivent apparaître.
- Après le changement de nom d'affichage en Cloud → Emails, recharger l'aperçu → le From doit indiquer « Soumission Comptable ».
