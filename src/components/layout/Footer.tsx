import { Link } from "@tanstack/react-router";
import { Facebook, Linkedin, Mail, MapPin } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import logo from "@/assets/brand/logo-soumissions-comptables.jpg";

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="bg-[#0F172A] text-slate-300 mt-12">
      <div className="max-w-[1200px] mx-auto px-6 py-10 md:py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-8 md:gap-8">
        <div>
          <div className="inline-flex items-center bg-white rounded-md p-2">
            <img
              src={logo}
              alt="SoumissionComptable.com"
              width={200}
              height={56}
              className="h-12 w-auto"
            />
          </div>
          <p className="mt-3 text-sm text-slate-400">{t.footer.tagline}</p>
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
          </div>
        </div>

        <div>
          <div className="text-white font-semibold mb-3">{t.footer.ourServices}</div>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/creation-entreprise-cote-divoire" className="hover:text-secondary">
                {t.services.creation}
              </Link>
            </li>
            <li>
              <Link to="/creer-son-entreprise-cote-divoire" className="hover:text-secondary">
                Créer son entreprise en 10 jours
              </Link>
            </li>
            <li>
              <Link to="/comptabilite-entreprise-abidjan" className="hover:text-secondary">
                {t.services.accounting}
              </Link>
            </li>
            <li>
              <Link to="/declaration-fiscale-cote-divoire" className="hover:text-secondary">
                {t.services.tax}
              </Link>
            </li>
            <li>
              <Link to="/domiciliation-entreprise-abidjan" className="hover:text-secondary">
                {t.services.domiciliation}
              </Link>
            </li>
            <li>
              <Link to="/cabinet-comptable-abidjan" className="hover:text-secondary">
                {t.services.audit}
              </Link>
            </li>
            <li>
              <Link to="/cabinet-comptable-abidjan" className="hover:text-secondary">
                {t.services.legal}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <div className="text-white font-semibold mb-3">{t.footer.usefulLinks}</div>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/comment-ca-marche" className="hover:text-secondary">
                {t.footer.links.howItWorks}
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:text-secondary">
                {t.footer.links.faq}
              </Link>
            </li>
            <li>
              <Link to="/a-propos" className="hover:text-secondary">
                {t.footer.links.about}
              </Link>
            </li>
            <li>
              <Link to="/cabinets-comptables-partenaires" className="hover:text-secondary">
                {t.footer.links.partners}
              </Link>
            </li>
            <li>
              <Link to="/guides" className="hover:text-secondary">
                {t.footer.links.guides}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <div className="text-white font-semibold mb-3">{t.footer.contact}</div>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0" />
              <a href="mailto:contact@soumissioncomptable.com" className="hover:text-secondary">
                contact@soumissioncomptable.com
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0" />
              {t.footer.location}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-700">
        <div className="max-w-[1200px] mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div>{t.footer.rights}</div>
          <div className="flex items-center gap-2">
            <a href="#" className="hover:text-secondary">
              {t.footer.privacy}
            </a>
            <span>|</span>
            <a href="#" className="hover:text-secondary">
              {t.footer.terms}
            </a>
          </div>
          <div>{t.footer.byLgm}</div>
        </div>
      </div>
    </footer>
  );
}
