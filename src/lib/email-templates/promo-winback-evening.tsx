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
  hoursLeft = 24,
  rechargeUrl = 'https://www.soumissioncomptable.com/recharger',
}: Props) => (
  <Html lang="fr" dir="ltr">
    <Head />
    <Preview>Dernière chance — l'offre expire dans quelques heures</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Dernière chance, {partnerFirstName}</Heading>
        <Text style={text}>
          Votre remise exclusive de <strong>1 prospect à 200 FCFA</strong> se termine
          dans <strong>{hoursLeft}h</strong>. Après cela, le prix reviendra à 1 000 FCFA
          par prospect.
        </Text>
        <div style={urgent}>
          <p style={urgentText}>
            <strong>Il ne reste que {hoursLeft} heures</strong> pour profiter de :
          </p>
          <p style={offerRow}>50 prospects pour 10 000 FCFA</p>
          <p style={offerRow}>125 prospects pour 25 000 FCFA</p>
          <p style={offerRow}>Illimité 2 mois pour 50 000 FCFA</p>
        </div>
        <Button style={button} href={rechargeUrl}>Profiter avant qu'il ne soit trop tard</Button>
        <Text style={ps}>
          Cette offre ne sera pas prolongée. Elle expire ce dimanche à minuit précis.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (data: Record<string, unknown>) => {
    const h = typeof data.hoursLeft === 'number' ? data.hoursLeft : 24
    return `Plus que ${h}h — dernière chance à 200 FCFA le prospect`
  },
  displayName: 'Winback soir (0 crédit)',
  previewData: { partnerFirstName: 'Koffi', hoursLeft: 12, rechargeUrl: 'https://www.soumissioncomptable.com/recharger' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px 28px', maxWidth: '560px' }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: '#0f172a', margin: '0 0 20px' }
const text = { fontSize: '15px', color: '#334155', lineHeight: '1.6', margin: '0 0 16px' }
const urgent = {
  backgroundColor: '#fef2f2',
  border: '2px solid #dc2626',
  borderRadius: '10px',
  padding: '14px 18px',
  margin: '4px 0 20px',
}
const urgentText = { fontSize: '15px', color: '#991b1b', margin: '0 0 8px' }
const offerRow = { fontSize: '14px', color: '#0f172a', margin: '4px 0', lineHeight: '1.5' }
const button = {
  backgroundColor: '#dc2626',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: 'bold' as const,
  borderRadius: '8px',
  padding: '14px 22px',
  textDecoration: 'none',
  display: 'inline-block',
  margin: '8px 0 20px',
}
const ps = { fontSize: '13px', color: '#64748b', margin: '20px 0 0', fontStyle: 'italic' as const }