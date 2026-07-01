## Deux actions

### 1. Corriger le formulaire de création manuelle (bug bloquant)

`src/routes/_authenticated.admin.tsx` → `CreatePartnerPanel` envoie encore l'ancien payload. Le schéma partagé exige désormais `contact_role`, `wants_website`, `wants_logo`, donc Zod rejette côté serveur et rien ne se crée.

Ajouts au formulaire :
- Champ texte **« Votre rôle au sein de l'entreprise »** (requis).
- Deux blocs **Oui / Non** : « Site internet ? » et « Logo ? ».
- Validation client + envoi de ces trois champs à `createPartnerManually`.

Aucune modif serveur ni migration nécessaire (la fonction serveur accepte déjà ces champs).

### 2. Créer le partenaire NEXVIA PARTNERS

Une fois le formulaire corrigé, j'utiliserai la fonction serveur `createPartnerManually` (via un appel ponctuel côté back-office) avec :

| Champ | Valeur |
|---|---|
| Cabinet | NEXVIA PARTNERS |
| Contact | SIHE Anicet |
| Rôle | Gérant *(défaut, à confirmer)* |
| Email | anicet.sihe@gmail.com |
| Téléphone | 0747482765 |
| Mot de passe initial | Ponmanin1 |
| Ville | Abidjan (+ San Pedro noté dans zones) |
| Facebook | Nexvia |
| Site web | — |
| Services | comptabilité, fiscalité, main d'œuvre temporaire, création d'entreprise, conseil en gestion |
| Zones | Abidjan (Yopougon, près du maquis Le Palais), San Pedro (quartier Lac, fin pavé) |
| Site internet souhaité | Non *(défaut)* |
| Logo souhaité | Non *(défaut)* |

Résultat attendu : compte auto-confirmé, statut `approved`, 30 crédits offerts, rôle `partner`, événement GHL `manual_creation` émis.

### Notes / défauts assumés

- **Rôle** : « Gérant » par défaut — dites-le moi si c'est autre chose.
- **Ville principale** : « Abidjan » (San Pedro placé en zones d'intervention car le champ `city` est unique).
- **Site internet / Logo** : « Non » par défaut — je pourrai le changer plus tard depuis la fiche partenaire.
- **Mot de passe** : stocké tel que fourni ; recommandez-lui de le changer à la première connexion.

### Vérification

Après création, je confirme via une requête sur `partners` que l'enregistrement existe avec le bon statut et 30 crédits.
