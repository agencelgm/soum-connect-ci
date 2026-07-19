import * as React from 'react'
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Props {
  partnerFirstName?: string
  prospectFirstName?: string
  service?: string
  city?: string
  message?: string | null
  creditsBalance?: number
  loginUrl?: string
}

const Email = ({
  partnerFirstName = 'Partenaire',
  prospectFirstName = 'Un prospect',
  service = 'un service comptable',
  city,
  message,
  creditsBalance = 0,
  loginUrl = 'https://soumissioncomptable.com/connexion',
}: Props) => (
  <Html lang="fr" dir="ltr">
    <Head />
    <Preview>{`Vous avez ${creditsBalance} crédits — ${prospectFirstName} vous attend`}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Vous n'avez rien à perdre.</Heading>
        <Text style={text}>Bonjour {partnerFirstName},</Text>
        <Text style={text}>
          <strong>{prospectFirstName}</strong> vient d'être approuvé{city ? <> à <strong>{city}</strong></> : null} et
          recherche : <strong>{service}</strong>.
        </Text>
        {message ? (
          <div style={quote}>
            <p style={quoteLabel}>Message du prospect :</p>
            <p style={quoteText}>« {message} »</p>
          </div>
        ) : null}
        <div style={callout}>
          Il vous reste <strong>{creditsBalance} crédit{creditsBalance > 1 ? 's' : ''}</strong> déjà
          payés sur votre compte.
        </div>
        <Text style={text}>
          Votre compte est en pause, mais ces crédits sont toujours à vous.
          Reconnectez-vous, débloquez ses coordonnées, et appelez-le. C'est tout.
          Trois clics et vous êtes en ligne avec un prospect qualifié.
        </Text>
        <Button style={button} href={loginUrl}>
          Me reconnecter et débloquer
        </Button>
        <Text style={ps}>
          <strong>P.S.</strong> Seuls 5 partenaires peuvent débloquer ce prospect.
          Passé ce cap, l'opportunité est perdue.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (data: Record<string, unknown>) => {
    const name = (data.prospectFirstName as string) || 'Un nouveau prospect'
    const credits = Number(data.creditsBalance ?? 0)
    return `${name} vous attend — vous avez ${credits} crédit${credits > 1 ? 's' : ''} inutilisés`
  },
  displayName: 'Nouveau prospect — partenaire en pause',
  previewData: {
    partnerFirstName: 'Marc',
    prospectFirstName: 'Awa',
    service: "Création d'entreprise",
    city: 'Abidjan',
    creditsBalance: 12,
    loginUrl: 'https://soumissioncomptable.com/connexion',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px 28px', maxWidth: '560px' }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: '#0f172a', margin: '0 0 20px' }
const text = { fontSize: '15px', color: '#334155', lineHeight: '1.6', margin: '0 0 16px' }
const callout = {
  backgroundColor: '#ecfdf5',
  border: '1px solid #10b981',
  color: '#065f46',
  padding: '12px 16px',
  borderRadius: '8px',
  margin: '0 0 16px',
  fontSize: '15px',
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
const ps = { fontSize: '13px', color: '#64748b', margin: '24px 0 0', fontStyle: 'italic' as const }
const quote = {
  backgroundColor: '#f8fafc',
  borderLeft: '3px solid #0f766e',
  padding: '12px 16px',
  borderRadius: '6px',
  margin: '0 0 16px',
}
const quoteLabel = {
  fontSize: '11px',
  fontWeight: 'bold' as const,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.06em',
  color: '#0f766e',
  margin: '0 0 6px',
}
const quoteText = {
  fontSize: '14px',
  color: '#334155',
  lineHeight: '1.6',
  fontStyle: 'italic' as const,
  margin: 0,
}