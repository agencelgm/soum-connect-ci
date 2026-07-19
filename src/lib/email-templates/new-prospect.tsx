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
  loginUrl?: string
}

const Email = ({
  partnerFirstName = 'Partenaire',
  prospectFirstName = 'Un prospect',
  service = 'un service comptable',
  city,
  message,
  loginUrl = 'https://www.soumissioncomptable.com/connexion',
}: Props) => (
  <Html lang="fr" dir="ltr">
    <Head />
    <Preview>
      {prospectFirstName} vient d'être approuvé — débloquez avant 5 autres partenaires
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>{prospectFirstName} vous recherche</Heading>
        <Text style={text}>Bonjour {partnerFirstName},</Text>
        <Text style={text}>
          Nous venons d'approuver la demande de <strong>{prospectFirstName}</strong>.
          {' '}Il/elle recherche : <strong>{service}</strong>
          {city ? <> à <strong>{city}</strong></> : null}.
        </Text>
        {message ? (
          <div style={quote}>
            <p style={quoteLabel}>Message du prospect :</p>
            <p style={quoteText}>« {message} »</p>
          </div>
        ) : null}
        <Text style={text}>
          Connectez-vous à votre compte pour débloquer ses coordonnées avant que 5
          autres partenaires ne le fassent.
        </Text>
        <Button style={button} href={loginUrl}>
          Voir le prospect
        </Button>
        <Text style={ps}>
          <strong>P.S.</strong> Une fois que 5 personnes auront débloqué ses
          informations, l'opportunité sera perdue à jamais.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (data: Record<string, unknown>) => {
    const name = (data.prospectFirstName as string) || 'Un nouveau prospect'
    return `${name} vous recherche`
  },
  displayName: 'Nouveau prospect approuvé',
  previewData: {
    partnerFirstName: 'Marc',
    prospectFirstName: 'Awa',
    service: 'Création d\'entreprise',
    city: 'Abidjan',
    loginUrl: 'https://www.soumissioncomptable.com/connexion',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px 28px', maxWidth: '560px' }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: '#0f172a', margin: '0 0 20px' }
const text = { fontSize: '15px', color: '#334155', lineHeight: '1.6', margin: '0 0 16px' }
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