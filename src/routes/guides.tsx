import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const META_TITLE =
  "Guides & Ressources | Création d'Entreprise & Comptabilité en CI";
const META_DESC =
  "Tous nos guides sur la création d'entreprise, la comptabilité et la fiscalité en Côte d'Ivoire. Des ressources gratuites pour les entrepreneurs ivoiriens.";

type Category = "Création d'entreprise" | "Comptabilité" | "Fiscalité" | "Diaspora";

type Article = {
  slug: string;
  title: string;
  excerpt: string;
  categories: Category[];
  readTime: string;
};

const ARTICLES: Article[] = [
  {
    slug: "creer-sarl-cepici-2026",
    title: "Comment créer une SARL au CEPICI en 2026 — Guide Complet",
    excerpt:
      "Toutes les étapes pour créer votre SARL via le guichet unique CEPICI : documents, capital, délais et coûts.",
    categories: ["Création d'entreprise"],
    readTime: "8 min",
  },
  {
    slug: "sarl-sa-ei-comparatif",
    title: "SARL vs SA vs Entreprise Individuelle en CI : quel statut choisir ?",
    excerpt:
      "Comparatif détaillé des trois formes juridiques les plus courantes en Côte d'Ivoire pour bien choisir.",
    categories: ["Création d'entreprise"],
    readTime: "6 min",
  },
  {
    slug: "obligations-comptables-sarl-ci",
    title: "Les obligations comptables d'une SARL en Côte d'Ivoire",
    excerpt:
      "Tenue de comptes SYSCOHADA, états financiers, DSF, audit : vos obligations annuelles expliquées simplement.",
    categories: ["Comptabilité"],
    readTime: "7 min",
  },
  {
    slug: "calendrier-fiscal-2026-ci",
    title: "Calendrier fiscal 2026 de la Côte d'Ivoire",
    excerpt:
      "Toutes les échéances fiscales 2026 : TVA, IS, DSF, CNPS, patente. Ne ratez aucune déclaration.",
    categories: ["Fiscalité"],
    readTime: "5 min",
  },
  {
    slug: "choisir-cabinet-comptable-abidjan",
    title: "Comment choisir son cabinet comptable à Abidjan ?",
    excerpt:
      "Les 5 critères essentiels pour sélectionner un cabinet comptable fiable et adapté à votre activité.",
    categories: ["Comptabilité"],
    readTime: "6 min",
  },
  {
    slug: "creer-entreprise-ci-depuis-france",
    title: "Créer son entreprise en CI depuis la France : guide étape par étape",
    excerpt:
      "Procuration, mandataire, CEPICI en ligne : comment monter votre société ivoirienne sans quitter la France.",
    categories: ["Création d'entreprise", "Diaspora"],
    readTime: "9 min",
  },
  {
    slug: "domiciliation-entreprise-abidjan-guide",
    title: "Domiciliation d'entreprise à Abidjan : tout ce qu'il faut savoir",
    excerpt:
      "Quartiers, tarifs, prestations incluses : guide complet pour domicilier votre société à Abidjan.",
    categories: ["Comptabilité"],
    readTime: "6 min",
  },
  {
    slug: "impots-entreprise-cote-divoire",
    title: "Quels impôts paye une entreprise en Côte d'Ivoire ?",
    excerpt:
      "IS, TVA, ITS, patente, CNPS : tour d'horizon complet de la fiscalité applicable aux sociétés en CI.",
    categories: ["Fiscalité"],
    readTime: "7 min",
  },
];

const FILTERS: Array<{ key: string; label: string }> = [
  { key: "all", label: "Tous" },
  { key: "Création d'entreprise", label: "Création d'entreprise" },
  { key: "Comptabilité", label: "Comptabilité" },
  { key: "Fiscalité", label: "Fiscalité" },
  { key: "Diaspora", label: "Diaspora" },
];

export const Route = createFileRoute("/guides")({
  head: () => ({
    meta: [
      { title: META_TITLE },
      { name: "description", content: META_DESC },
      { property: "og:title", content: META_TITLE },
      { property: "og:description", content: META_DESC },
      { property: "og:url", content: "/guides" },
    ],
    links: [{ rel: "canonical", href: "/guides" }],
  }),
  component: Page,
});

function ArticleCard({ article, featured = false }: { article: Article; featured?: boolean }) {
  return (
    <article
      className={`group flex flex-col rounded-2xl border border-border bg-white overflow-hidden hover:border-primary/40 hover:shadow-lg transition-all ${
        featured ? "md:flex-row" : ""
      }`}
    >
      <div
        className={`bg-gradient-to-br from-primary to-primary-dark ${
          featured ? "md:w-2/5 min-h-[200px]" : "h-32"
        } flex items-center justify-center`}
        aria-hidden="true"
      >
        <span className="text-white/30 font-heading font-bold text-5xl">
          {article.title.charAt(0)}
        </span>
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex flex-wrap gap-2 mb-3">
          {article.categories.map((c) => (
            <Badge key={c} variant="secondary" className="bg-secondary/10 text-secondary hover:bg-secondary/20">
              {c}
            </Badge>
          ))}
        </div>
        <h3
          className={`font-heading font-bold text-primary group-hover:text-secondary transition-colors ${
            featured ? "text-2xl md:text-3xl" : "text-lg"
          }`}
        >
          {article.title}
        </h3>
        <p className={`mt-2 text-muted-foreground leading-relaxed ${featured ? "text-base" : "text-sm"}`}>
          {article.excerpt}
        </p>
        <div className="mt-4 flex items-center justify-between pt-4 border-t border-border">
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            {article.readTime} de lecture
          </span>
          <a
            href={`/guides/${article.slug}`}
            className="inline-flex items-center gap-1 text-sm font-semibold text-secondary hover:text-secondary-dark"
          >
            Lire la suite
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </article>
  );
}

function Page() {
  const [filter, setFilter] = useState<string>("all");

  const filtered =
    filter === "all"
      ? ARTICLES
      : ARTICLES.filter((a) => a.categories.includes(filter as Category));

  const [featured, ...rest] = filtered;

  return (
    <main>
      {/* Hero */}
      <section className="bg-[#F8FAFC] border-b border-border">
        <div className="container-app py-14 md:py-20 text-center">
          <h1 className="font-heading font-bold text-primary text-3xl md:text-5xl max-w-3xl mx-auto leading-tight">
            Guides & Ressources pour Entrepreneurs en Côte d'Ivoire
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Tous nos guides pratiques sur la création d'entreprise, la comptabilité et la fiscalité en CI.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="container-app pt-10">
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList className="flex flex-wrap h-auto justify-start gap-2 bg-transparent p-0">
            {FILTERS.map((f) => (
              <TabsTrigger
                key={f.key}
                value={f.key}
                className="rounded-full border border-border bg-white px-4 py-2 text-sm data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:border-primary"
              >
                {f.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </section>

      {/* Articles */}
      <section className="container-app py-10 md:py-14">
        {filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">
            Aucun article dans cette catégorie pour le moment.
          </p>
        ) : (
          <div className="space-y-8">
            {featured && <ArticleCard article={featured} featured />}
            {rest.length > 0 && (
              <div className="grid md:grid-cols-2 gap-6">
                {rest.map((a) => (
                  <ArticleCard key={a.slug} article={a} />
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}