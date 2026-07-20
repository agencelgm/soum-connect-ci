import * as React from 'react'
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Text,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Lead {
  prospectFirstName?: string
  service?: string
  city?: string | null
  audience?: string | null
  budget?: string | null
  message?: string | null
  leadUrl?: string
}

interface Props {
  partnerFirstName?: string
  isPaused?: boolean
  creditsBalance?: number
  hasUnlimited?: boolean
  unlimitedUntil?: string | null
  leads?: Lead[]
  loginUrl?: string
  rechargeUrl?: string
  whatsappUrl?: string
}

const Email = ({
  partnerFirstName = 'Partenaire',
  isPaused = false,
  creditsBalance = 0,
  hasUnlimited = false,
  unlimitedUntil = null,
  leads = [],
  loginUrl = 'https://www.soumissioncomptable.com/connexion',
  rechargeUrl = 'https://www.soumissioncomptable.com/connexion',
  whatsappUrl = 'https://wa.me/2250700000000',
}: Props) => {
  const n = leads.length
  const title =
    n <= 1
      ? `1 nouveau prospect vous attend`
      : `${n} nouveaux prospects vous attendent`
  return (
    <Html lang="fr" dir="ltr">
      <Head />
      <Preview>
        {n <= 1
          ? `Nouveau prospect approuvé — connectez-vous pour le débloquer`
          : `${n} prospects approuvés aujourd'hui — à débloquer avant les autres`}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>{title}</Heading>
          <Text style={text}>Bonjour {partnerFirstName},</Text>
          <Text style={text}>
            Voici {n <= 1 ? 'le prospect approuvé' : `les ${n} prospects approuvés`}
            {' '}aujourd'hui sur Soumission Comptable. Connectez-vous pour débloquer
            leurs coordonnées avant que 5 autres partenaires ne le fassent.
          </Text>

          {leads.map((lead, i) => (
            <div key={i} style={card}>
              <p style={cardTitle}>
                {lead.prospectFirstName || 'Un prospect'}
                {lead.city ? <span style={cardCity}> — {lead.city}</span> : null}
              </p>
              <p style={cardService}>
                <strong>Service :</strong> {lead.service || 'Service comptable'}
              </p>
              {lead.audience ? (
                <p style={cardMeta}><strong>Profil :</strong> {lead.audience}</p>
              ) : null}
              {lead.budget ? (
                <p style={cardMeta}><strong>Budget :</strong> {lead.budget}</p>
              ) : null}
              {lead.message ? (
                <p style={cardMessage}>« {lead.message} »</p>
              ) : null}
              <Button style={cardCta} href={lead.leadUrl || loginUrl}>
                Voir ce prospect
              </Button>
            </div>
          ))}

          <Hr style={hr} />

          {isPaused ? (
            <>
              <Text style={warn}>
                ⚠️ Votre compte est actuellement <strong>en pause</strong>
                {creditsBalance > 0
                  ? ` (vous avez encore ${creditsBalance} crédit${creditsBalance > 1 ? 's' : ''} disponibles).`
                  : `.`}
                {' '}Réactivez-le pour débloquer ces prospects.
              </Text>
              <Button style={buttonAlt} href={whatsappUrl}>
                Réactiver mon compte (WhatsApp)
              </Button>
            </>
          ) : hasUnlimited ? (
            <Text style={info}>
              🚀 Vous bénéficiez de l'<strong>accès illimité</strong>
              {unlimitedUntil ? ` jusqu'au ${formatDate(unlimitedUntil)}` : ''} —
              débloquez autant de prospects que vous voulez sans dépenser de crédits.
            </Text>
          ) : (
            <Text style={info}>
              💳 Solde actuel : <strong>{creditsBalance} crédit{creditsBalance > 1 ? 's' : ''}</strong>.
              {creditsBalance < 1 ? ' Rechargez pour débloquer ces prospects.' : ''}
            </Text>
          )}

          <Button style={button} href={loginUrl}>
            Me connecter à mon espace
          </Button>

          {!isPaused && !hasUnlimited && creditsBalance < 5 ? (
            <Text style={ps}>
              <a href={rechargeUrl} style={link}>Recharger mes crédits →</a>
            </Text>
          ) : null}

          <Text style={ps}>
            <strong>P.S.</strong> Ces prospects sont partagés avec un maximum de 5
            partenaires. Premier arrivé, premier servi.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}

export const template = {
  component: Email,
  subject: (data: Record<string, unknown>) => {
    const leads = (data.leads as unknown[] | undefined) ?? []
    const n = leads.length || 1
    return n <= 1
      ? `1 nouveau prospect vous attend aujourd'hui`
      : `${n} nouveaux prospects vous attendent aujourd'hui`
  },
  displayName: 'Récapitulatif quotidien des nouveaux prospects',
  previewData: {
    partnerFirstName: 'Marc',
    isPaused: false,
    creditsBalance: 12,
    hasUnlimited: false,
    leads: [
      {
        prospectFirstName: 'Awa',
        service: "Création d'entreprise",
        city: 'Abidjan',
        audience: "Création d'entreprise",
        budget: '150 000 – 300 000 FCFA',
        message:
          "Je souhaite créer une SARL à Abidjan pour lancer mon activité de conseil.",
        leadUrl: 'https://www.soumissioncomptable.com/marketplace?lead=demo-1',
      },
      {
        prospectFirstName: 'Kouadio',
        service: 'Comptabilité mensuelle',
        city: 'Yopougon',
        audience: 'Gestion / comptabilité',
        budget: '75 000 – 150 000 FCFA / mois',
        message: null,
        leadUrl: 'https://www.soumissioncomptable.com/marketplace?lead=demo-2',
      },
    ],
    loginUrl: 'https://www.soumissioncomptable.com/connexion',
    rechargeUrl: 'https://www.soumissioncomptable.com/connexion',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px 28px', maxWidth: '600px' }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: '#0f172a', margin: '0 0 20px' }
const text = { fontSize: '15px', color: '#334155', lineHeight: '1.6', margin: '0 0 16px' }
const card = {
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  padding: '14px 16px',
  margin: '0 0 14px',
  backgroundColor: '#f8fafc',
}
const cardTitle = {
  fontSize: '16px',
  fontWeight: 'bold' as const,
  color: '#0f172a',
  margin: '0 0 6px',
}
const cardCity = { fontWeight: 'normal' as const, color: '#64748b' }
const cardService = { fontSize: '14px', color: '#0f172a', margin: '4px 0' }
const cardMeta = { fontSize: '13px', color: '#334155', margin: '2px 0' }
const cardMessage = {
  fontSize: '13px',
  color: '#334155',
  fontStyle: 'italic' as const,
  margin: '8px 0',
  borderLeft: '3px solid #0f766e',
  paddingLeft: '10px',
}
const cardCta = {
  backgroundColor: '#0f766e',
  color: '#ffffff',
  fontSize: '13px',
  fontWeight: 'bold' as const,
  borderRadius: '6px',
  padding: '8px 14px',
  textDecoration: 'none',
  display: 'inline-block',
  marginTop: '8px',
}
const button = {
  backgroundColor: '#0f766e',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: 'bold' as const,
  borderRadius: '8px',
  padding: '14px 22px',
  textDecoration: 'none',
  display: 'inline-block',
  margin: '8px 0 20px',
}
const buttonAlt = {
  backgroundColor: '#25D366',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: 'bold' as const,
  borderRadius: '8px',
  padding: '12px 20px',
  textDecoration: 'none',
  display: 'inline-block',
  margin: '4px 0 16px',
}
const hr = { borderColor: '#e2e8f0', margin: '20px 0' }
const warn = {
  fontSize: '14px',
  color: '#9a3412',
  backgroundColor: '#fff7ed',
  padding: '10px 14px',
  borderRadius: '6px',
  margin: '0 0 12px',
}
const info = {
  fontSize: '14px',
  color: '#0f172a',
  backgroundColor: '#f0fdfa',
  padding: '10px 14px',
  borderRadius: '6px',
  margin: '0 0 16px',
}
const ps = { fontSize: '13px', color: '#64748b', margin: '16px 0 0' }
const link = { color: '#0f766e', textDecoration: 'underline' }