import * as React from 'react'
import { Body, Button, Container, Head, Heading, Html, Preview, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Props {
  partnerFirstName?: string
  expiresLabel?: string
  rechargeUrl?: string
}

const Email = ({
  partnerFirstName = 'Partenaire',
  expiresLabel = 'dans 4 jours',
  rechargeUrl = 'https://www.soumissioncomptable.com/recharger',
}: Props) => (
  <Html lang="fr" dir="ltr">
    <Head />
    <Preview>Un prospect à 200 FCFA au lieu de 1 000 — offre limitée</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Bonjour {partnerFirstName},</Heading>
        <Text style={text}>
          Vous avez déjà utilisé plus de la moitié de vos 30 prospects offerts. Pour vous
          remercier, nous divisons le coût de vos prochains prospects par 5 :
        </Text>
        <div style={offerBox}>
          <p style={priceBig}>
            <span style={hot}>200 FCFA</span> <span style={perLead}>par prospect</span>
          </p>
          <p style={priceSmall}><span style={strike}>1 000 FCFA</span> le prix habituel</p>
          <hr style={sep} />
          <p style={offerRow}>10 000 FCFA = <strong>50 prospects</strong></p>
          <p style={offerRow}>25 000 FCFA = <strong>125 prospects</strong></p>
          <p style={offerRow}>50 000 FCFA = <strong>Illimité 60 jours</strong></p>
        </div>
        <Text style={text}>
          À titre de comparaison, un lead comptable qualifié coûte entre 3 000 et
          8 000 FCFA sur Facebook Ads. Chez nous, ce sera <strong>200 FCFA</strong>
          {' '}pendant 4 jours seulement.
        </Text>
        <Text style={text}>
          Offre exclusive, expire <strong>{expiresLabel}</strong>.
        </Text>
        <Button style={button} href={rechargeUrl}>Réserver mes prospects</Button>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: 'Un prospect à 200 FCFA — offre limitée à 4 jours',
  displayName: 'Promo 50% — Variante B (prix par lead)',
  previewData: {
    partnerFirstName: 'Awa',
    expiresLabel: 'dans 4 jours',
    rechargeUrl: 'https://www.soumissioncomptable.com/recharger',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px 28px', maxWidth: '560px' }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: '#0f172a', margin: '0 0 20px' }
const text = { fontSize: '15px', color: '#334155', lineHeight: '1.6', margin: '0 0 16px' }
const offerBox = {
  backgroundColor: '#f0fdf4',
  border: '2px solid #16a34a',
  borderRadius: '10px',
  padding: '16px 20px',
  margin: '4px 0 20px',
  textAlign: 'center' as const,
}
const priceBig = { fontSize: '32px', fontWeight: 'bold' as const, margin: '4px 0', color: '#166534' }
const priceSmall = { fontSize: '13px', color: '#64748b', margin: '0 0 8px' }
const perLead = { fontSize: '14px', color: '#166534', fontWeight: 'normal' as const, marginLeft: '4px' }
const hot = { color: '#16a34a' }
const strike = { color: '#94a3b8', textDecoration: 'line-through' as const }
const sep = { border: 'none', borderTop: '1px solid #bbf7d0', margin: '12px 0' }
const offerRow = { fontSize: '14px', color: '#0f172a', margin: '4px 0', lineHeight: '1.5' }
const button = {
  backgroundColor: '#16a34a',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: 'bold' as const,
  borderRadius: '8px',
  padding: '14px 22px',
  textDecoration: 'none',
  display: 'inline-block',
  margin: '8px 0 20px',
}