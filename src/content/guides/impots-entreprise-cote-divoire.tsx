import { Link } from "@tanstack/react-router";
import {
  ArticleSection,
  ArticleTable,
  ArticleCallout,
  ArticleList,
  ArticleCTA,
} from "@/components/guides/article-blocks";

export function ImpotsEntrepriseContent() {
  return (
    <>
      <p className="text-lg text-foreground/90 leading-relaxed">
        Quels <strong>impôts paye une entreprise en Côte d'Ivoire</strong> en
        2026 ? Entre l'IS, la TVA, les ITS, la patente et la CNPS, le panorama
        peut sembler dense. Ce guide vous présente chaque prélèvement, les
        taux applicables et les obligations déclaratives, pour piloter votre
        fiscalité sans mauvaise surprise.
      </p>

      <ArticleSection title="Quels sont les principaux impôts payés par une entreprise en CI ?">
        <p>
          Une entreprise ivoirienne supporte cinq prélèvements principaux :{" "}
          <strong>l'impôt sur les sociétés (IS), la TVA, les ITS sur
          salaires, la patente et les cotisations CNPS</strong>. Selon votre
          activité, des taxes sectorielles peuvent s'y ajouter (BIC, AIRSI,
          taxe sur les boissons, etc.).
        </p>
        <ArticleTable
          headers={["Impôt / cotisation", "Taux 2026", "Périodicité"]}
          rows={[
            ["Impôt sur les sociétés (IS)", "25 %", "Annuel + acomptes"],
            ["TVA", "18 % (taux standard)", "Mensuelle"],
            ["ITS (salaires)", "Barème progressif", "Mensuelle"],
            ["CNPS (part patronale)", "18,45 % (varie selon risque)", "Mensuelle"],
            ["Patente", "Variable selon CA et activité", "Annuelle"],
            ["Contribution foncière", "Selon valeur locative", "Annuelle"],
          ]}
          caption="Source : Code général des impôts ivoirien 2026 et CNPS."
        />
      </ArticleSection>

      <ArticleSection title="Comment fonctionne l'impôt sur les sociétés ?">
        <p>
          L'<strong>IS frappe le bénéfice net</strong> de toute SARL, SARLU
          ou SA au taux de 25 % en 2026. Un minimum forfaitaire d'impôt
          (MFI) s'applique même en cas de perte : 0,5 % du chiffre d'affaires
          HT, avec un plancher de 3 000 000 FCFA.
        </p>
        <ArticleList
          items={[
            "Trois acomptes trimestriels : 15 avril, 15 juin, 15 septembre.",
            "Solde à régler au 30 avril N+1 lors du dépôt de la DSF.",
            "Le MFI s'impute sur l'IS dû. S'il dépasse l'IS, le surplus reste acquis au Trésor.",
            "Les exonérations CEPICI (régime de faveur, ZFC) peuvent réduire ou suspendre l'IS pendant 5 à 15 ans.",
          ]}
        />
        <ArticleCallout variant="info" title="Différents régimes selon le CA">
          Le régime réel normal s'applique au-delà de 200 millions FCFA de
          CA HT. En dessous, le régime réel simplifié allège les obligations
          déclaratives (TVA trimestrielle possible).
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection title="Quel est le mécanisme de la TVA ivoirienne ?">
        <p>
          La <strong>TVA s'applique au taux de 18 %</strong> sur la majorité
          des biens et services. Un taux réduit de 9 % vise certains produits
          (lait, pâtes alimentaires). Vous collectez la TVA sur vos ventes,
          déduisez celle payée sur vos achats, et reversez la différence à la
          DGI chaque mois.
        </p>
        <p>
          Pour aller plus loin, lisez notre guide dédié{" "}
          <Link to="/guides/$slug" params={{ slug: "tva-cote-divoire-pme" }} className="text-secondary underline">
            la TVA en Côte d'Ivoire pour les PME
          </Link>
          .
        </p>
      </ArticleSection>

      <ArticleSection title="Quelles charges sociales sur les salaires ?">
        <p>
          Les <strong>ITS et la CNPS</strong> sont prélevés mensuellement sur
          chaque bulletin. La part salariale CNPS est de 6,3 %, la part
          patronale autour de 18,45 % (variable selon le taux d'accident du
          travail du secteur). Les ITS suivent un barème progressif allant de
          1,5 % à 60 % selon les tranches.
        </p>
        <ArticleList
          items={[
            "Cotisations CNPS plafonnées à 1 647 315 FCFA par salarié et par mois (plafond 2026).",
            "Retenues ITS reversées le 15 du mois suivant.",
            "État 301 récapitulatif annuel à déposer avant le 31 janvier.",
          ]}
        />
      </ArticleSection>

      <ArticleSection title="La patente et les taxes locales sont-elles importantes ?">
        <p>
          La <strong>patente</strong> reste un poste budgétaire à anticiper :
          son montant dépend du chiffre d'affaires, de la nature de
          l'activité et de la commune. Pour une PME abidjanaise classique,
          comptez entre 200 000 et 2 000 000 FCFA par an.
        </p>
        <p>
          Pour ne rater aucune échéance, consultez notre{" "}
          <Link to="/guides/$slug" params={{ slug: "calendrier-fiscal-ci-2026" }} className="text-secondary underline">
            calendrier fiscal 2026
          </Link>
          . Vous pouvez aussi{" "}
          <Link to="/demande-soumissions" className="text-secondary underline">
            demander des soumissions
          </Link>{" "}
          de cabinets comptables agréés OECCA-CI pour déléguer l'ensemble de
          vos déclarations.
        </p>
      </ArticleSection>

      <ArticleCTA />

      <ArticleSection title="Questions fréquentes">
        <h3 className="font-heading font-semibold text-primary text-lg mt-6">Une SARL en perte paie-t-elle quand même de l'impôt ?</h3>
        <p>
          Oui, via le Minimum Forfaitaire d'Impôt (MFI) de 0,5 % du CA HT,
          avec un plancher de 3 000 000 FCFA pour les sociétés.
        </p>
        <h3 className="font-heading font-semibold text-primary text-lg mt-6">Existe-t-il des exonérations fiscales en Côte d'Ivoire ?</h3>
        <p>
          Oui. Le code des investissements CEPICI prévoit des exonérations
          d'IS, de TVA et de droits de douane pendant 5 à 15 ans selon la
          zone et le secteur d'activité.
        </p>
        <h3 className="font-heading font-semibold text-primary text-lg mt-6">Quel est le taux d'IS pour les start-up ?</h3>
        <p>
          Le taux standard reste 25 %. Les start-up agréées peuvent obtenir
          des allègements via le statut d'entreprise innovante ou le régime
          CEPICI.
        </p>
        <h3 className="font-heading font-semibold text-primary text-lg mt-6">La TVA est-elle obligatoire dès le premier franc de CA ?</h3>
        <p>
          Oui pour toute société soumise au régime réel. L'EI au régime
          forfaitaire (TEE) est exonérée de TVA collectée mais ne peut pas
          déduire la TVA sur ses achats.
        </p>
      </ArticleSection>
    </>
  );
}