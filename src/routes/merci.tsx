import { createFileRoute } from "@tanstack/react-router";
import { buildPageHead } from "@/lib/seo";
import { FinalThankYouCard } from "@/components/upsell/FinalThankYouCard";
import { useFormationGate } from "@/hooks/useFormationGate";

export const Route = createFileRoute("/merci")({
  head: () => {
    const head = buildPageHead({
      path: "/merci",
      title: "Merci | SoumissionComptable.com",
      description:
        "Merci d'avoir rempli notre formulaire. Un membre de notre équipe vous contactera dans les 24 heures ouvrables.",
      altPath: "/en/thank-you",
      breadcrumb: [
        { name: "Accueil", path: "/" },
        { name: "Merci", path: "/merci" },
      ],
    });
    head.meta.push({ name: "robots", content: "noindex, nofollow" });
    return head;
  },
  component: MerciPage,
});

function MerciPage() {
  useFormationGate("/merci");
  return (
    <main className="bg-[#F8FAFC] min-h-screen flex items-center">
      <section className="container-app py-16 md:py-24 w-full">
        <FinalThankYouCard intro="Toutes vos réponses ont bien été enregistrées. Notre équipe vous appellera pour valider votre demande avant que les cabinets comptables ne vous contactent." />
      </section>
    </main>
  );
}