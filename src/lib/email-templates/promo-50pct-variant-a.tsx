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
    <Preview>Offre exclusive : 5× plus de prospects sur votre prochaine recharge</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Bonjour {partnerFirstName},</Heading>
        <Text style={text}>
          Vous avez déjà utilisé plus de la moitié de vos <strong>30 prospects offerts</strong>
          {' '}— bravo, votre activité tourne. Pour vous remercier et vous aider à passer
          à la vitesse supérieure, nous vous débloquons une offre exclusive :
        </Text>
        <div style={offerBox}>
          <p style={offerRow}><strong>10 000 FCFA →</strong> <span style={hot}>50 prospects</span> <span style={strike}>au lieu de 10</span></p>
          <p style={offerRow}><strong>25 000 FCFA →</strong> <span style={hot}>125 prospects</span> <span style={strike}>au lieu de 25</span></p>
          <p style={offerRow}><strong>50 000 FCFA →</strong> <span style={hot}>Illimité 2 mois</span> <span style={strike}>au lieu d'1 mois</span></p>
        </div>
        <Text style={text}>
          Soit <strong>5 fois plus de prospects</strong> pour le même prix. Une seule condition :
          l'offre expire <strong>{expiresLabel}</strong> et n'est pas cumulable.
        </Text>
        <Button style={button} href={rechargeUrl}>Profiter de l'offre</Button>
        <Text style={ps}>
          <strong>P.S.</strong> Cette remise est appliquée automatiquement à la caisse.
          Vous n'avez rien à saisir.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: '5× plus de prospects pour votre prochaine recharge',
  displayName: 'Promo 50% — Variante A (crédits)',
  previewData: {
    partnerFirstName: 'Marc',
    expiresLabel: 'dans 4 jours',
    rechargeUrl: 'https://www.soumissioncomptable.com/recharger',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px 28px', maxWidth: '560px' }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: '#0f172a', margin: '0 0 20px' }
const text = { fontSize: '15px', color: '#334155', lineHeight: '1.6', margin: '0 0 16px' }
const offerBox = {
  backgroundColor: '#fff7ed',
  border: '2px solid #f59e0b',
  borderRadius: '10px',
  padding: '16px 20px',
  margin: '4px 0 20px',
}
const offerRow = { fontSize: '15px', color: '#0f172a', margin: '6px 0', lineHeight: '1.5' }
const hot = { color: '#c2410c', fontWeight: 'bold' as const }
const strike = { color: '#94a3b8', textDecoration: 'line-through' as const, marginLeft: '6px', fontSize: '13px' }
const button = {
  backgroundColor: '#c2410c',
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