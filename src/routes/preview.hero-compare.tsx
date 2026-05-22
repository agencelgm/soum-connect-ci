import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import heroAccountant from "@/assets/home/hero-accountant-cutout.png";

export const Route = createFileRoute("/preview/hero-compare")({
  head: () => ({
    meta: [
      { title: "Comparaison hero — interne" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: HeroComparePage,
});

function HeroComparePage() {
  const [oldVersion, setOldVersion] = useState<string | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setOldVersion(url);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">
          Comparaison avant / après — personnage hero
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Page interne (noindex). Comparez la version actuelle (à gauche) avec
          l'ancienne version (à droite) avant de confirmer un revert.
        </p>
        <div className="mt-4 rounded-md border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          <strong>Recommandé :</strong> pour récupérer l'image au byte près,
          utilisez le bouton revert (↪️) sous le message du chat qui contenait
          la bonne version, ou l'onglet History. C'est plus fiable qu'un
          re-upload manuel.
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <figure className="rounded-lg border bg-card p-4">
          <figcaption className="mb-3 text-sm font-semibold text-foreground">
            Version actuelle (pointe le formulaire)
          </figcaption>
          <div className="flex h-[420px] items-end justify-center overflow-hidden rounded bg-muted/40">
            <img
              src={heroAccountant}
              alt="Version actuelle du personnage hero"
              className="h-full w-auto object-contain object-bottom"
            />
          </div>
        </figure>

        <figure className="rounded-lg border bg-card p-4">
          <figcaption className="mb-3 flex items-center justify-between text-sm font-semibold text-foreground">
            <span>Ancienne version (à téléverser)</span>
            <label className="cursor-pointer rounded-md border border-input bg-background px-3 py-1 text-xs font-medium hover:bg-accent">
              Choisir un fichier
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleUpload}
              />
            </label>
          </figcaption>
          <div className="flex h-[420px] items-end justify-center overflow-hidden rounded bg-muted/40">
            {oldVersion ? (
              <img
                src={oldVersion}
                alt="Ancienne version du personnage hero"
                className="h-full w-auto object-contain object-bottom"
              />
            ) : (
              <p className="px-6 text-center text-xs text-muted-foreground">
                Téléversez ici l'ancien PNG pour le comparer côte à côte.
              </p>
            )}
          </div>
        </figure>
      </div>

      <p className="mt-8 text-sm text-muted-foreground">
        Une fois votre choix fait, dites-le en chat : si vous gardez l'actuelle,
        je supprime cette page ; si vous préférez l'ancienne, indiquez le
        message du chat à utiliser pour le revert.
      </p>
    </div>
  );
}