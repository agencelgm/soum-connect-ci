import * as React from 'react'
import { Body, Button, Container, Head, Heading, Html, Preview, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Props {
  partnerFirstName?: string
  daysLeft?: number
  rechargeUrl?: string
}

const Email = ({
  partnerFirstName = 'Partenaire',
  daysLeft = 4,
  rechargeUrl = 'https://www.soumissioncomptable.com/recharger',
}: Props) => (
  <Html lang="fr" dir="ltr">
    <Head />
    <Preview>On vous a manqué — offre exclusive de retour</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>{partnerFirstName}, on ne vous a pas oublié</Heading>
        <Text style={text}>
          Bonjour {partnerFirstName}, cela fait un moment que vous n'avez pas rechargé
          votre compte. Chaque semaine, nous approuvons des dizaines de nouveaux prospects
          qualifiés en Côte d'Ivoire — et ils cherchent un cabinet comme le vôtre.
        </Text>
        <Text style={text}>
          Pour vous encourager à revenir, nous avons débloqué pour vous une remise
          exclusive : <strong>1 prospect à 200 FCFA</strong> au lieu de 1 000 FCFA,
          disponible uniquement pour vous.
        </Text>
        <div style={offerBox}>
          <p style={offerRow}>10 000 FCFA → <strong>50 prospects</strong></p>
          <p style={offerRow}>25 000 FCFA → <strong>125 prospects</strong></p>
          <p style={offerRow}>50 000 FCFA → <strong>Illimité 2 mois</strong></p>
        </div>
        <Text style={text}>
          Cette offre expire <strong>dimanche à minuit</strong> — soit dans {daysLeft} jour{daysLeft > 1 ? 's' : ''}.
        </Text>
        <Button style={button} href={rechargeUrl}>Réactiver mon compte</Button>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: 'On vous a manqué — offre exclusive jusqu\'à dimanche',
  displayName: 'Winback matin (0 crédit)',
  previewData: { partnerFirstName: 'Marc', daysLeft: 4, rechargeUrl: 'https://www.soumissioncomptable.com/recharger' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px 28px', maxWidth: '560px' }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: '#0f172a', margin: '0 0 20px' }
const text = { fontSize: '15px', color: '#334155', lineHeight: '1.6', margin: '0 0 16px' }
const offerBox = {
  backgroundColor: '#f8fafc',
  border: '1px solid #cbd5e1',
  borderRadius: '8px',
  padding: '12px 16px',
  margin: '4px 0 16px',
}
const offerRow = { fontSize: '14px', color: '#0f172a', margin: '4px 0', lineHeight: '1.5' }
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