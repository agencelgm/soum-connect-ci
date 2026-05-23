import {
  ArticleSection,
  ArticleCallout,
  ArticleList,
  ArticleCTA,
  ArticleTable,
} from "@/components/guides/article-blocks";

export function RccmCoteDivoireContent() {
  return (
    <>
      <ArticleCallout variant="info" title="En bref">
        <p>
          Le RCCM (Registre du Commerce et du Crédit Mobilier) est le numéro
          d&apos;immatriculation officiel de votre entreprise en Côte d&apos;Ivoire.
          Il est délivré par le CEPICI dans les 24 à 72 heures suivant le dépôt
          d&apos;un dossier complet. Le RCCM identifie votre entreprise auprès des
          administrations, des banques et de vos partenaires commerciaux. Sans
          RCCM, une société n&apos;existe pas légalement.
        </p>
      </ArticleCallout>

      <ArticleSection title="Qu'est-ce que le RCCM en Côte d'Ivoire ?">
        <p>
          Le <strong>RCCM</strong> — Registre du Commerce et du Crédit Mobilier
          — est le registre public qui recense toutes les entreprises
          commerciales légalement constituées en Côte d&apos;Ivoire. Il est géré
          dans le cadre du droit OHADA et tenu par le greffe du tribunal de
          commerce, centralisé via le guichet unique du CEPICI.
        </p>
        <p>
          Votre numéro RCCM est votre identifiant officiel. Il figure
          obligatoirement sur vos factures, contrats, documents administratifs
          et correspondances avec la DGI, la CNPS et les administrations.
        </p>
        <p>
          Format typique : <strong>CI-ABJ-2026-B-12345</strong>.
        </p>
      </ArticleSection>

      <ArticleSection title="Quelle est la différence entre RCCM, DFE et IDU ?">
        <ArticleTable
          headers={["Document", "Signification", "Émis par", "Usage"]}
          rows={[
            ["RCCM", "Registre du Commerce et du Crédit Mobilier", "Greffe / CEPICI", "Identifie la société commercialement"],
            ["DFE", "Déclaration Fiscale d'Existence", "DGI / CEPICI", "Identifie la société fiscalement (NCC)"],
            ["IDU", "Identifiant Unique", "CEPICI", "Regroupe les identifiants administratifs"],
          ]}
        />
      </ArticleSection>

      <ArticleSection title="Comment obtenir le RCCM ?">
        <p>
          Le RCCM s&apos;obtient automatiquement lors de la création de votre
          entreprise au CEPICI. Pas de démarche séparée.
        </p>
        <h3 className="font-heading font-semibold text-lg text-foreground mt-4">
          Étape 1 — Préparer le dossier
        </h3>
        <p>
          Pour une SARL : pièce d&apos;identité des associés, statuts signés,
          justificatif de siège, attestation de dépôt du capital et formulaire
          unique personne morale.
        </p>
        <h3 className="font-heading font-semibold text-lg text-foreground mt-4">
          Étape 2 — Déposer au CEPICI
        </h3>
        <p>Au guichet unique (Plateau, Abidjan) ou en ligne via e-CEPICI.</p>
        <h3 className="font-heading font-semibold text-lg text-foreground mt-4">
          Étape 3 — Traitement
        </h3>
        <p>
          Délai pour un dossier complet et conforme :{" "}
          <strong>24 à 72 heures ouvrées</strong>.
        </p>
        <h3 className="font-heading font-semibold text-lg text-foreground mt-4">
          Étape 4 — Réception des documents
        </h3>
        <p>
          Le CEPICI remet : RCCM, DFE, IDU, fiche CNPS et statuts enregistrés.
        </p>
      </ArticleSection>

      <ArticleSection title="Combien coûte l'immatriculation au RCCM ?">
        <p>
          Le coût est inclus dans les frais officiels CEPICI : entre{" "}
          <strong>50 000 et 150 000 FCFA</strong> selon la forme juridique et le
          capital.
        </p>
      </ArticleSection>

      <ArticleSection title="Qu'est-ce qu'un extrait RCCM et comment l'obtenir ?">
        <p>
          Un <strong>extrait RCCM</strong> récapitule les informations
          enregistrées : dénomination, forme juridique, capital, siège,
          dirigeants, objet social et numéro d&apos;immatriculation.
        </p>
        <p>Il est demandé par :</p>
        <ArticleList
          items={[
            "Les banques (ouverture de compte, crédit)",
            "Les partenaires commerciaux",
            "Les administrations (appels d'offres)",
            "Les bailleurs lors d'une location de bureau",
          ]}
        />
        <p>
          <strong>Où l&apos;obtenir :</strong> guichet CEPICI (24-48 heures),
          portail e-CEPICI, ou via votre cabinet comptable. Coût : 5 000 à 15
          000 FCFA.
        </p>
        <p>
          <strong>Validité :</strong> les partenaires exigent souvent un extrait
          de moins de 3 mois.
        </p>
      </ArticleSection>

      <ArticleSection title="Que faire en cas de perte du RCCM original ?">
        <p>
          Vous pouvez obtenir un duplicata auprès du greffe via le CEPICI. Sur
          présentation du numéro RCCM et d&apos;une pièce d&apos;identité du dirigeant,
          un nouveau certificat est délivré. Coût : 5 000 à 15 000 FCFA.
        </p>
      </ArticleSection>

      <ArticleSection title="Comment modifier son RCCM après la création ?">
        <p>
          Tout changement (siège, gérant, dénomination, objet, capital) doit
          être inscrit au RCCM via une <strong>modification statutaire</strong>.
          Décision d&apos;AG, avenant aux statuts, dépôt modificatif au CEPICI.
        </p>
        <p>
          Délai : 5 à 15 jours. Coût indicatif : 30 000 à 80 000 FCFA en frais
          officiels, plus honoraires du cabinet.
        </p>
      </ArticleSection>

      <ArticleSection title="Questions fréquentes">
        <div className="space-y-6">
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Peut-on vérifier le RCCM d&apos;une société en CI ?
            </h3>
            <p className="mt-2">
              Oui. Le registre du commerce est public. Via le guichet CEPICI ou
              certains portails en ligne, vous pouvez vérifier l&apos;existence et
              les informations d&apos;une société à partir de son numéro RCCM.
            </p>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Le RCCM doit-il figurer sur les factures ?
            </h3>
            <p className="mt-2">
              Oui, obligatoirement. Le Code OHADA impose la mention du RCCM, de
              la forme juridique, du capital, du siège et du NCC sur toutes les
              factures commerciales.
            </p>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Peut-on facturer avant d&apos;avoir le RCCM ?
            </h3>
            <p className="mt-2">
              Non. Sans RCCM, votre société n&apos;existe pas légalement. Émettre
              des factures sans RCCM est une infraction.
            </p>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Le RCCM expire-t-il ?
            </h3>
            <p className="mt-2">
              Non. Le RCCM reste valable tant que la société existe. Seuls les
              extraits RCCM ont une validité pratique limitée (3 mois).
            </p>
          </div>
        </div>
      </ArticleSection>

      <ArticleCTA
        title="Obtenez votre RCCM rapidement avec un cabinet agréé"
        description="Un cabinet comptable agréé OECCA-CI prépare votre dossier, le dépose au CEPICI et vous remet tous vos documents officiels (RCCM, DFE, IDU)."
        ctaLabel="Comparer 5 cabinets agréés"
      />
      <p className="mt-6 text-sm text-muted-foreground">
        Mis à jour en mai 2026. Sources : Acte Uniforme OHADA, CEPICI.
      </p>
    </>
  );
}