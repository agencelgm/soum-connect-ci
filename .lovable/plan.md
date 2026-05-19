## Objectif

Aligner `public/robots.txt` sur le template fourni : ajouter les bots manquants (ChatGPT-User, anthropic-ai, Bingbot, Common Crawl) et la règle `Disallow: /*.json$`.

## Changement

Mettre à jour `public/robots.txt` pour qu'il contienne :

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /*.json$

Sitemap: https://soumissionscomptables.ci/sitemap.xml

# Allow all AI search bots for citation
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Bingbot
Allow: /

# Block training-only crawlers (no citation benefit)
User-agent: CCBot
Disallow: /

User-agent: Common Crawl
Disallow: /
```

## Notes

- Le projet n'a pas d'admin ni d'API publique exposée pour l'instant, mais les Disallow restent défensifs (sans impact si les chemins n'existent pas).
- `Disallow: /*.json$` empêche l'indexation des fichiers `.json` (ex. manifest), pratique standard.
- Le sitemap est conservé sur le domaine final `soumissionscomptables.ci` comme dans la version actuelle.

## Hors périmètre

- Pas de modification de `src/routes/sitemap[.]xml.ts` (déjà existant et indépendant de ce template).
