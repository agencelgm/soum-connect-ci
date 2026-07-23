## Plan

### Objectif
Remplacer l'expression « Premier rendez-vous gratuit » par « Rendez-vous gratuit » sur toutes les pages où elle apparaît.

### Recherche effectuée
`rg -n "Premier rendez-vous gratuit" /dev-server/src --type ts`

### Résultats trouvés
Deux occurrences, toutes dans le même fichier :
- `src/routes/offre-gestion-marketing.tsx:20` — méta description SEO
- `src/routes/offre-gestion-marketing.tsx:101` — texte affiché en page

### Modifications à apporter
1. `src/routes/offre-gestion-marketing.tsx`
   - Ligne 20 : remplacer `"Premier rendez-vous gratuit avec un spécialiste marketing..."` par `"Rendez-vous gratuit avec un spécialiste marketing..."`
   - Ligne 101 : remplacer l'affichage `Premier rendez-vous gratuit` par `Rendez-vous gratuit`

### Fichiers non concernés
- Le bouton « Prendre mon rendez-vous gratuit » reste inchangé (ne contient pas « Premier »).
- Aucune autre page du projet ne contient cette expression.

### Vérification
- Re-vérification avec `rg` après modification pour confirmer qu'aucune occurrence ne subsiste.
- Aperçu visuel rapide de la page `/offre-gestion-marketing`.