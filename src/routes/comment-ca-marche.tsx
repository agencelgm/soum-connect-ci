import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ClipboardList,
  MessageSquare,
  BarChart3,
  Shield,
  Wallet,
  FileCheck,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { buildPageHead } from "@/lib/seo";
import { RelatedLinks } from "@/components/seo/RelatedLinks";
import { getPageRelations } from "@/lib/page-relations";

const META_TITLE = "Comment Ça Marche | SoumissionComptable.com";
const META_DESC =
  "Découvrez comment obtenir jusqu'à 5 soumissions gratuites de cabinets comptables agréés en Côte d'Ivoire en moins de 48h. Processus simple en 3 étapes.";

export const Route = createFileRoute("/comment-ca-marche")({
  head: () =>
    buildPageHead({
      path: "/comment-ca-marche",
      title: META_TITLE,
      description: META_DESC,
      breadcrumb: [
        { name: "Accueil", path: "/" },
        { name: "Comment ça marche", path: "/comment-ca-marche" },
      ],
    }),
  component: Page,
});

const steps = [
  {
    num: "01",
    icon: ClipboardList,
    title: "Remplissez le formulaire (2 minutes)",
    intro: "Indiquez-nous votre besoin en quelques clics :",
    details: [
      "Type de service recherché",
      "Votre localisation (Abidjan, autre ville CI, ou depuis l'étranger)",
      "Informations de contact (nom, email, téléphone)",
      "Description rapide de votre besoin (optionnel)",
    ],
    badge: "⏱ 2 minutes en moyenne",
  },
  {
    num: "02",
    icon: MessageSquare,
    title: "Nos cabinets partenaires vous contactent",
    intro: "Nous orchestrons la mise en relation pour vous :",
    details: [
      "Votre demande est transmise aux cabinets adaptés à votre besoin",
      "Les cabinets vérifient leur disponibilité et préparent leur offre",
      "Vous recevez jusqu'à 5 soumissions personnalisées",
    ],
    badge: "⏱ Réponse en 48h maximum",
  },
  {
    num: "03",
    icon: BarChart3,
    title: "Comparez et choisissez",
    intro: "Vous gardez le contrôle de bout en bout :",
    details: [
      "Lisez chaque soumission attentivement",
      "Posez vos questions directement aux cabinets",
      "Choisissez le cabinet qui correspond à votre budget et vos attentes",
      "Aucun engagement, aucune obligation",
    ],
    badge: "✅ Aucune obligation d'achat",
  },
] as const;

const reassurance = [
  {
    icon: Shield,
    emoji: "🔒",
    q: "Est-ce que mes informations sont sécurisées ?",
    a: "Toutes vos données sont chiffrées et utilisées uniquement pour transmettre votre demande aux cabinets sélectionnés. Nous ne revendons jamais vos informations à des tiers.",
  },
  {
    icon: Wallet,
    emoji: "💰",
    q: "Y a-t-il des frais cachés ?",
    a: "Le service est 100% gratuit pour vous. Les cabinets partenaires paient une commission uniquement si vous choisissez de travailler avec l'un d'eux.",
  },
  {
    icon: FileCheck,
    emoji: "📋",
    q: "Suis-je obligé de choisir un cabinet ?",
    a: "Non, absolument pas. Vous comparez les soumissions à votre rythme et vous êtes libre de ne retenir aucune offre si aucune ne vous convient.",
  },
] as const;

const personas = [
  {
    emoji: "🏢",
    title: "Entrepreneurs & PME",
    desc: "Dirigeants en Côte d'Ivoire qui cherchent un cabinet comptable fiable pour structurer leur gestion.",
  },
  {
    emoji: "🌍",
    title: "Diaspora ivoirienne",
    desc: "Ivoiriens installés à l'étranger souhaitant créer ou gérer une activité au pays à distance.",
  },
  {
    emoji: "💼",
    title: "Investisseurs étrangers",
    desc: "Sociétés et investisseurs qui s'implantent en Côte d'Ivoire et ont besoin d'un accompagnement local.",
  },
  {
    emoji: "🚀",
    title: "Startups & créateurs",
    desc: "Porteurs de projets qui veulent lancer leur entreprise rapidement avec les bons conseils.",
  },
] as const;

function Page() {
  return (
    <>
      {/* HERO */}
      <section className="bg-[#F8FAFC]" aria-labelledby="hero-title">
        <div className="container-app section">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Accueil</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Comment ça marche</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1
            id="hero-title"
            className="font-heading text-3xl md:text-5xl font-bold text-primary leading-tight max-w-3xl"
          >
            Comment Obtenir vos Soumissions de Cabinets Comptables
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            Notre processus est simple, rapide et 100% gratuit pour vous.
          </p>
        </div>
      </section>

      {/* SECTION 1 — Processus détaillé */}
      <section className="bg-white" aria-labelledby="process-title">
        <div className="container-app section">
          <h2
            id="process-title"
            className="font-heading text-2xl md:text-4xl font-bold text-primary text-center"
          >
            3 Étapes pour Recevoir vos Soumissions
          </h2>
          <div className="mt-12 flex flex-col gap-6">
            {steps.map((s) => {
              const Icon = s.icon;
              return (
                <article
                  key={s.num}
                  className="rounded-2xl border border-border bg-white p-6 md:p-10 shadow-sm grid md:grid-cols-[auto_1fr] gap-6 md:gap-10"
                >
                  <div className="flex md:flex-col items-center md:items-start gap-4">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary text-white font-heading font-bold text-2xl">
                      {s.num}
                    </div>
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                      <Icon className="h-7 w-7" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-heading text-xl md:text-2xl font-bold text-foreground">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-muted-foreground">{s.intro}</p>
                    <ul className="mt-4 space-y-2">
                      {s.details.map((d) => (
                        <li key={d} className="flex gap-3 text-foreground/90">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                    <span className="mt-5 inline-flex items-center rounded-full bg-secondary/10 px-4 py-2 text-sm font-medium text-secondary">
                      {s.badge}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 2 — Pour vous rassurer */}
      <section className="bg-[#F8FAFC]" aria-labelledby="reassure-title">
        <div className="container-app section">
          <h2
            id="reassure-title"
            className="font-heading text-2xl md:text-4xl font-bold text-primary text-center"
          >
            Vos Questions, Nos Réponses
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {reassurance.map((r) => (
              <article
                key={r.q}
                className="rounded-2xl border border-border bg-white p-6 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10 text-2xl">
                  {r.emoji}
                </div>
                <h3 className="mt-4 font-heading text-lg font-bold text-foreground">
                  {r.q}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {r.a}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 — Pour qui */}
      <section className="bg-white" aria-labelledby="personas-title">
        <div className="container-app section">
          <h2
            id="personas-title"
            className="font-heading text-2xl md:text-4xl font-bold text-primary text-center"
          >
            La Plateforme est Faite Pour…
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {personas.map((p) => (
              <article
                key={p.title}
                className="rounded-2xl border border-border bg-white p-6 text-center shadow-sm"
              >
                <div className="text-5xl">{p.emoji}</div>
                <h3 className="mt-4 font-heading text-lg font-bold text-foreground">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 — CTA */}
      <section className="bg-secondary text-white" aria-labelledby="cta-title">
        <div className="container-app section text-center">
          <h2
            id="cta-title"
            className="font-heading text-2xl md:text-4xl font-bold"
          >
            Prêt ? C'est gratuit et sans engagement
          </h2>
          <p className="mt-3 text-white/90 max-w-xl mx-auto">
            Recevez jusqu'à 5 soumissions personnalisées de cabinets comptables agréés en 48h.
          </p>
          <div className="mt-8 flex justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-secondary hover:bg-white/90 h-12 px-8 text-base font-semibold"
            >
              <Link to="/demande-soumissions">
                Recevoir mes soumissions
                <ArrowRight className="ml-1 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      {(() => {
        const rel = getPageRelations("/comment-ca-marche");
        return rel ? <RelatedLinks items={rel.related} /> : null;
      })()}
    </>
  );
}
