import { Link } from "@tanstack/react-router";
import { BarChart2, Facebook, Linkedin, Mail, MapPin } from "lucide-react";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#0F172A] text-slate-300 mt-12">
      <div className="max-w-[1200px] mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-secondary" />
          <span className="font-heading font-bold text-white text-base">Soumissions <span className="text-secondary">Comptables</span></span>
          </div>
          <p className="mt-3 text-sm text-slate-400">
            Trouvez le meilleur cabinet comptable en Côte d'Ivoire
          </p>
          <div className="mt-4 flex items-center gap-3">
            <a
              href="https://www.facebook.com/profile.php?id=61572845235281"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-slate-400 hover:text-secondary"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" aria-label="LinkedIn" className="text-slate-400 hover:text-secondary">
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href="https://wa.me/2250767009629"
              aria-label="WhatsApp"
              className="text-slate-400 hover:text-secondary"
            >
              <WhatsAppIcon className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div>
          <div className="text-white font-semibold mb-3">Nos Services</div>
          <ul className="space-y-2 text-sm">
            <li><Link to="/creation-entreprise-cote-divoire" className="hover:text-secondary">Création d'entreprise</Link></li>
            <li><Link to="/comptabilite-entreprise-abidjan" className="hover:text-secondary">Comptabilité</Link></li>
            <li><Link to="/declaration-fiscale-cote-divoire" className="hover:text-secondary">Déclaration fiscale</Link></li>
            <li><Link to="/domiciliation-entreprise-abidjan" className="hover:text-secondary">Domiciliation Abidjan</Link></li>
            <li><Link to="/cabinet-comptable-abidjan" className="hover:text-secondary">Audit comptable</Link></li>
            <li><Link to="/cabinet-comptable-abidjan" className="hover:text-secondary">Conseil juridique</Link></li>
          </ul>
        </div>

        <div>
          <div className="text-white font-semibold mb-3">Liens utiles</div>
          <ul className="space-y-2 text-sm">
            <li><Link to="/comment-ca-marche" className="hover:text-secondary">Comment ça marche</Link></li>
            <li><Link to="/faq" className="hover:text-secondary">FAQ</Link></li>
            <li><Link to="/a-propos" className="hover:text-secondary">À propos</Link></li>
            <li><Link to="/cabinets-comptables-partenaires" className="hover:text-secondary">Cabinets partenaires</Link></li>
            <li><Link to="/guides" className="hover:text-secondary">Guides &amp; Ressources</Link></li>
          </ul>
        </div>

        <div>
          <div className="text-white font-semibold mb-3">Contact</div>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <WhatsAppIcon className="h-4 w-4 text-[#25D366] shrink-0" />
              <a href="https://wa.me/2250767009629" className="hover:text-secondary">+225 07 67 00 96 29</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0" />
              <a href="mailto:contact@soumissionscomptables.ci" className="hover:text-secondary">
                contact@soumissionscomptables.ci
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0" />
              Abidjan, Côte d'Ivoire
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-700">
        <div className="max-w-[1200px] mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div>© 2026 SoumissionsComptables.ci — Tous droits réservés</div>
          <div className="flex items-center gap-2">
            <a href="#" className="hover:text-secondary">Politique de confidentialité</a>
            <span>|</span>
            <a href="#" className="hover:text-secondary">Conditions d'utilisation</a>
          </div>
          <div>Une réalisation de LGM — Les Gens du Marketing</div>
        </div>
      </div>
    </footer>
  );
}
