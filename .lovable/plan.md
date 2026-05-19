## Corrections à apporter

### 1. Adresse de contact
Remplacer l'adresse du siège **« Plateau, Abidjan, Côte d'Ivoire »** par **« Angré Château, camp militaire, Abidjan, Côte d'Ivoire »**.

Fichiers à modifier :
- `src/lib/translations.ts` — clé `contactAddressValue` (FR ligne 238, EN ligne 561)

Note : les autres mentions de « Plateau » dans le site (FAQ, page Cabinet Abidjan, Domiciliation, liste des quartiers couverts par les cabinets partenaires, etc.) **restent inchangées** — elles décrivent les quartiers où se trouvent les cabinets partenaires, pas l'adresse de SoumissionsComptables.ci.

### 2. Logo officiel
Intégrer le logo fourni (cercle jaune + texte cyan « Soumission Comptable ») dans le Header et le Footer, à la place de l'icône `BarChart2` actuellement utilisée comme placeholder.

Étapes :
1. Copier `user-uploads://WhatsApp_Image_2026-05-19_at_12.41.07.jpeg` vers `src/assets/brand/logo-soumissions-comptables.jpg`.
2. `src/components/layout/Header.tsx` : remplacer le bloc `<BarChart2 …/> + texte` par `<img src={logo} alt="SoumissionsComptables.ci" width={160} height={40} className="h-9 w-auto" />`. Garder le `<Link>` parent vers l'accueil.
3. `src/components/layout/Footer.tsx` : même remplacement dans la colonne marque (logo un peu plus grand, ex. `h-10`).
4. Retirer les imports `BarChart2` devenus inutilisés.

### Hors périmètre
- Pas de changement sur le favicon ni les images Open Graph (peut être fait dans une autre passe si souhaité).
- Pas de modification du contenu éditorial existant.