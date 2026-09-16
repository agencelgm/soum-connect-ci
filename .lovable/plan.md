# Audit SEO / AEO / GEO — SoumissionComptable.com

Analyse effectuée sur le site actuel (scan de fondations + lecture du code). Voici l'état réel, puis les corrections proposées.

## Ce qui est déjà solide

- Pages rendues côté serveur : Google et les robots IA voient le vrai contenu.
- Version markdown propre servie aux assistants IA (ChatGPT, Perplexity, Claude).
- Titre, description, aperçu social et balise canonique corrects sur l'accueil.
- Balisage structuré partout : Organisation, fil d'Ariane, Article, FAQ, HowTo.
- robots.txt autorise explicitement GPTBot, PerplexityBot, ClaudeBot, Google-Extended.
- llms.txt présent, FAQ en HTML statique (balises details), versions FR/EN liées entre elles.

## Problèmes trouvés

1. **Aucune icône de site déclarée.** Les fichiers existent (favicon.ico / favicon.svg) mais aucune page ne les référence : Google n'affiche pas de logo à côté du résultat, et l'onglet du navigateur reste vide.
2. **Incohérence www / sans-www.** Tout le site (liens canoniques, sitemap, robots.txt) pointe vers `www.soumissioncomptable.com`, alors que le domaine de référence du projet est `soumissioncomptable.com`. Deux adresses pour le même contenu = signaux dilués.
3. **Entêtes « ne pas mettre en cache » sur tout le site.** Chaque page demande aux navigateurs et robots de ne rien garder en cache : pages plus lentes, budget d'exploration gaspillé.
4. **Nom de marque incohérent** dans l'aperçu social : « SoumissionsComptables.ci » au niveau global contre « SoumissionComptable.com » sur chaque page.
5. **Pages non indexables présentes dans le sitemap** : l'offre site internet et 2 guides encore vides (sur 27) y figurent alors qu'ils sont en noindex — contradiction pour Google.
6. **Dates de modification artificielles** : la plupart des entrées du sitemap portent la date du jour à chaque génération, ce qui n'a aucune valeur et finit par être ignoré.
7. **llms.txt en retard** : il annonce `/blog` (redirigée), ignore 4 guides publiés et l'Académie.
8. **Image de partage unique** : toutes les pages partagent la même image, aucune image propre aux guides — moins de clics sur les partages et moins de reprise par les IA.

## Corrections proposées

**Priorité haute**
- Déclarer l'icône du site (ico + svg + icône Apple) sur toutes les pages.
- Choisir une seule adresse de référence et l'appliquer partout (liens canoniques, sitemap, robots.txt, emails). Recommandation : garder `www.soumissioncomptable.com` puisque le site l'utilise déjà partout, et rediriger la version sans www — sinon on bascule tout vers la version sans www.
- Retirer les entêtes « ne pas mettre en cache » des pages publiques.

**Priorité moyenne**
- Retirer du sitemap les pages en noindex (offre site internet, guides sans contenu) et ne garder les dates de modification que lorsqu'elles proviennent réellement du contenu.
- Uniformiser le nom de marque dans les aperçus sociaux.
- Mettre à jour llms.txt : retirer /blog, ajouter les guides manquants et l'Académie.

**Priorité basse (AEO / GEO)**
- Utiliser l'image de chaque guide comme image de partage de la page.
- Ajouter un bloc « En bref » (40-60 mots) en tête des guides qui n'en ont pas encore, format directement repris par les IA et les extraits Google.
- Compléter ou dépublier les 2 guides vides.

## Détails techniques

- Icône : ajouter les entrées `links` (`rel="icon"`, `rel="apple-touch-icon"`) dans `src/routes/__root.tsx`.
- Domaine : `SITE_URL` dans `src/lib/seo.ts`, `BASE_URL` dans `src/routes/sitemap[.]xml.ts`, ligne `Sitemap:` de `public/robots.txt`.
- Cache : supprimer les `httpEquiv` Cache-Control / Pragma / Expires du head racine.
- Sitemap : filtrer `ARTICLES` sur la présence de `content`, retirer `/offre-site-internet`, remplacer `lastmod: today` par `updatedAt`/`publishedAt` ou l'omettre.
- Marque : aligner `og:site_name` racine sur `SITE_NAME`.
- Partage : passer `ogImage` en URL absolue de l'image de l'article dans `src/routes/guides.$slug.tsx`.

## À valider avant de démarrer

Adresse de référence : **avec www** (recommandé, aucun changement d'URL) ou **sans www** (conforme au domaine déclaré du projet, mais toutes les URL canoniques changent).
