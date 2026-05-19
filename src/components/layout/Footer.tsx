import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background-alt mt-12">
      <div className="container-app py-12 grid gap-8 md:grid-cols-4">
        <div>
          <div className="font-heading text-base font-bold text-primary">SoumissionsComptables</div>
          <p className="mt-2 text-sm text-muted-foreground">
            Plateforme de mise en relation entre entreprises et cabinets comptables en Côte d'Ivoire.
          </p>
        </div>
        <div>
          <div className="text-sm font-semibold text-foreground mb-3">Services</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/creation-entreprise-cote-divoire" className="hover:text-primary">Création d'entreprise</Link></li>
            <li><Link to="/comptabilite-entreprise-abidjan" className="hover:text-primary">Comptabilité</Link></li>
            <li><Link to="/declaration-fiscale-cote-divoire" className="hover:text-primary">Déclaration fiscale</Link></li>
            <li><Link to="/domiciliation-entreprise-abidjan" className="hover:text-primary">Domiciliation</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold text-foreground mb-3">Ressources</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/guides" className="hover:text-primary">Guides</Link></li>
            <li><Link to="/faq" className="hover:text-primary">FAQ</Link></li>
            <li><Link to="/comment-ca-marche" className="hover:text-primary">Comment ça marche</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold text-foreground mb-3">Entreprise</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/a-propos" className="hover:text-primary">À propos</Link></li>
            <li><Link to="/cabinets-comptables-partenaires" className="hover:text-primary">Cabinets partenaires</Link></li>
            <li><Link to="/cabinet-comptable-abidjan" className="hover:text-primary">Cabinet à Abidjan</Link></li>
            <li><Link to="/creation-entreprise-diaspora-ivoirienne" className="hover:text-primary">Diaspora</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-app py-4 text-xs text-muted-foreground">
          © {new Date().getFullYear()} SoumissionsComptables — Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}