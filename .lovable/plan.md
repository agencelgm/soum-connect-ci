Implémenter 4 pages en réutilisant `ServicePage`. Chaque route définit son propre `head()` (meta + canonical + JSON-LD).

## 1. `/comptabilite-entreprise-abidjan`
- Icône `Calculator`, breadcrumb : Accueil › Services › Comptabilité générale.
- Sections :
  - **Pourquoi externaliser** : 3 cartes (coût maîtrisé, expertise OHADA/SYSCOHADA, focus métier).
  - **Services inclus** : liste à puces (tenue de livres, états financiers, bilan annuel, déclarations mensuelles TVA/CNPS, conseil).
  - **Tableau** comparatif Interne vs Externalisé (Coût, Compétence, Flexibilité, Risque, Idéal pour).
  - **Fourchette de prix** : 50 000 – 300 000 FCFA / mois.
- FAQs (5) dont "Est-ce obligatoire d'avoir un comptable pour une SARL en CI ?".
- JSON-LD : `FAQPage`.
- Related : Création d'entreprise, Déclaration fiscale, Domiciliation.

## 2. `/declaration-fiscale-cote-divoire`
- Icône `Receipt`, breadcrumb : Accueil › Services › Déclaration fiscale.
- Sections :
  - **Calendrier fiscal CI** : tableau (DSF annuelle avant 30 juin, TVA mensuelle 15, IS acomptes, CNPS, ITS).
  - **Principaux impôts** : cartes IS, TVA, CNPS, TPS/Patente.
  - **Risques de non-conformité** : pénalités DGI (intérêts de retard, majorations, redressements).
- FAQs (5) dont "Quand doit-on soumettre la DSF en Côte d'Ivoire ?".
- JSON-LD : `FAQPage`.
- Related : Comptabilité, Création d'entreprise, Cabinet Abidjan.

## 3. `/domiciliation-entreprise-abidjan`
- Icône `MapPin`, breadcrumb : Accueil › Services › Domiciliation Abidjan.
- Sections :
  - **Définition** (50 mots) : la domiciliation = attribution d'une adresse légale par un prestataire agréé pour le siège social.
  - **Pourquoi domicilier** : diaspora, expatriés, startups, image professionnelle, mobilité.
  - **Ce qu'on obtient** : adresse légale, réception/scan courrier, accès bureaux/salles de réunion à la demande.
  - **Fourchette de prix** : 30 000 – 100 000 FCFA / mois selon quartier (Plateau premium, Cocody intermédiaire, Marcory/Yopougon économique).
- FAQs (4).
- JSON-LD : `FAQPage`.
- Related : Création d'entreprise, Comptabilité, Cabinet Abidjan.

## 4. `/cabinet-comptable-abidjan` (page géographique)
Adaptation : pour rester DRY on **réutilise `ServicePage`** mais on adapte la prop `breadcrumb` (Accueil › Villes › Abidjan) et le contenu. Pas de nouveau composant.
- Icône `Building` (ou `MapPin`).
- Sections :
  - **Pourquoi Abidjan concentre les cabinets** : capitale économique, sièges sociaux, CEPICI, OECCA-CI.
  - **Quartiers business** : paragraphe Plateau (CBD), Cocody (résidentiel/standing), Marcory (Zone 4, PME/import-export).
  - **Tableau** Quartier × Type de cabinet × Profil clientèle.
  - **Comment choisir** : 4 critères (agrément OECCA-CI, spécialisation sectorielle, tarifs transparents, disponibilité/proximité).
- FAQs (5) sur la recherche de cabinet à Abidjan.
- JSON-LD : `LocalBusiness` (name "SoumissionsComptables.ci", areaServed Abidjan, address locality Abidjan, region CI) + `FAQPage`.
- Related : Création d'entreprise, Comptabilité, Déclaration fiscale.

## Technique
- Tous les fichiers route existent déjà (placeholders) — on les **réécrit**.
- Imports communs : `createFileRoute`, `Calculator`, `Receipt`, `MapPin`, `Building2`, `ServicePage`, types `Faq`/`RelatedService`.
- Tokens du design system uniquement.
- Aucune modif du composant `ServicePage`, du Header ni du Footer.