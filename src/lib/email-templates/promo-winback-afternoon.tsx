import * as React from 'react'
import { Body, Button, Container, Head, Heading, Html, Preview, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Props {
  partnerFirstName?: string
  hoursLeft?: number
  rechargeUrl?: string
}

const Email = ({
  partnerFirstName = 'Partenaire',
  hoursLeft = 72,
  rechargeUrl = 'https://www.soumissioncomptable.com/recharger',
}: Props) => (
  <Html lang="fr" dir="ltr">
    <Head />
    <Preview>Rappel : votre remise exclusive expire bientôt</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Rappel : votre offre est encore active</Heading>
        <Text style={text}>
          Bonjour {partnerFirstName}, votre remise exclusive de <strong>1 prospect à 200 FCFA</strong>
          {' '}est toujours disponible. Il vous reste environ <strong>{hoursLeft}h</strong> pour en profiter.
        </Text>
        <div style={offerBox}>
          <p style={offerRow}>10 000 FCFA → <strong>50 prospects</strong> (au lieu de 10)</p>
          <p style={offerRow}>25 000 FCFA → <strong>125 prospects</strong> (au lieu de 25)</p>
          <p style={offerRow}>50 000 FCFA → <strong>Illimité 2 mois</strong> (au lieu d'1 mois)</p>
        </div>
        <Text style={text}>
          Un prospect qualifié via Facebook Ads en Côte d'Ivoire coûte entre 3 000 et 8 000 FCFA.
          Ici, vous êtes à <strong>200 FCFA</strong> — mais uniquement jusqu'à dimanche minuit.
        </Text>
        <Button style={button} href={rechargeUrl}>Recharger maintenant</Button>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: 'Rappel : votre remise expire bientôt',
  displayName: 'Winback après-midi (0 crédit)',
  previewData: { partnerFirstName: 'Awa', hoursLeft: 72, rechargeUrl: 'https://www.soumissioncomptable.com/recharger' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px 28px', maxWidth: '560px' }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: '#0f172a', margin: '0 0 20px' }
const text = { fontSize: '15px', color: '#334155', lineHeight: '1.6', margin: '0 0 16px' }
const offerBox = {
  backgroundColor: '#fef3c7',
  border: '1px solid #f59e0b',
  borderRadius: '8px',
  padding: '12px 16px',
  margin: '4px 0 16px',
}
const offerRow = { fontSize: '14px', color: '#0f172a', margin: '4px 0', lineHeight: '1.5' }
const button = {
  backgroundColor: '#d97706',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: 'bold' as const,
  borderRadius: '8px',
  padding: '14px 22px',
  textDecoration: 'none',
  display: 'inline-block',
  margin: '8px 0 20px',
}