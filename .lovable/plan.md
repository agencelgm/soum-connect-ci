## Remplacer les 12 images de services par de vraies photos

### Constat
Les 12 images actuelles de la section « Nos services » (`src/assets/services/*.jpg`) ont été générées par IA. Même en demandant un rendu documentaire, le résultat reste « lisse » et identifiable comme IA. Pour obtenir un rendu vraiment réaliste, il faut passer à de **vraies photographies de stock** (photos prises par des photographes humains).

### Approche
Utiliser **Unsplash** comme source : photos professionnelles, gratuites, licence commerciale, sans attribution obligatoire. Chaque image sera téléchargée en haute qualité (1200×900, qualité 80) puis enregistrée localement dans `src/assets/services/` en gardant les mêmes noms de fichiers — aucun changement d'import nécessaire dans `src/routes/index.tsx`.

### Mapping des 12 services → photos réelles

| Service | Sujet de la photo |
|---|---|
| comptabilite-generale | Comptable au bureau avec calculatrice et documents |
| creation-entreprise | Poignée de main / signature de contrat professionnel |
| fiscalite | Bureau avec déclarations fiscales et calculatrice |
| audit | Documents financiers avec graphiques, stylo et loupe |
| paie-cnps | Bulletins de paie / RH au travail |
| conseil-juridique | Avocat avec contrats, plume, livres de droit |
| domiciliation | Immeuble de bureaux moderne (skyline / building) |
| diaspora | Personne en visioconférence avec ordinateur portable |
| reporting | Tableaux de bord financiers, graphiques sur écran |
| bancaire | Rendez-vous bancaire / poignée de main avec banquier |
| conformite-fiscale | Bureau de contrôleur fiscal, dossiers réglementaires |
| audit-interne | Réunion d'équipe d'audit autour d'une table |

### Étapes techniques
1. Script `bash` qui télécharge 12 photos Unsplash sélectionnées (URLs directes `images.unsplash.com/photo-...?w=1200&q=80`) vers `src/assets/services/{nom}.jpg`, en **écrasant** les fichiers IA existants.
2. Vérification visuelle rapide (taille, validité JPEG) après téléchargement.
3. Aucune modification de code nécessaire — les imports dans `src/routes/index.tsx` pointent déjà sur ces chemins.

### Note importante
Les photos Unsplash sont des photos universelles (pas spécifiquement « Côte d'Ivoire / Abidjan »). Comme vous voulez prioritairement du **réel et professionnel** plutôt que du **localisé africain**, cette approche est cohérente avec votre demande. Si plus tard vous souhaitez des photos spécifiquement africaines/ivoiriennes, il faudra soit en commander à un photographe, soit acheter sur une banque d'images spécialisée — Unsplash en a très peu sur ce thème précis.

### Hors périmètre
- Pas de changement des images de la page d'accueil hors section services (déjà traitées précédemment).
- Pas de changement du code de la section services (layout, overlay icône, etc.).
