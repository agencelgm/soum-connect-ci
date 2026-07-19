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
  daysLeft?: number
  expiresAt?: string
  renewUrl?: string
}

const Email = ({
  partnerFirstName = 'Partenaire',
  daysLeft = 7,
  expiresAt,
  renewUrl = 'https://soumissioncomptable.com/recharger',
}: Props) => {
  const isUrgent = daysLeft <= 1
  const dayLabel = daysLeft <= 1 ? 'demain' : `dans ${daysLeft} jours`
  return (
    <Html lang="fr" dir="ltr">
      <Head />
      <Preview>Votre accès illimité expire {dayLabel}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>
            {isUrgent ? '⚠️ Dernier rappel' : '⏰ Rappel important'} : votre accès
            illimité expire {dayLabel}
          </Heading>
          <Text style={text}>Bonjour {partnerFirstName},</Text>
          <Text style={text}>
            Votre accès illimité à la marketplace de{' '}
            <strong>SoumissionsComptables.ci</strong> expire {dayLabel}
            {expiresAt ? <> (le {new Date(expiresAt).toLocaleDateString('fr-FR')})</> : null}.
          </Text>
          <Text style={text}>
            Pour continuer à bénéficier de la fenêtre prioritaire de 3 heures et
            débloquer autant de prospects que vous voulez, renouvelez dès
            maintenant en un clic.
          </Text>
          <Button style={{ ...button, backgroundColor: isUrgent ? '#dc2626' : '#ea580c' }} href={renewUrl}>
            Renouveler mon accès illimité
          </Button>
          <Text style={ps}>
            Sans renouvellement, vous repasserez au tarif standard (1 crédit par
            prospect débloqué) et perdrez la fenêtre prioritaire.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: Email,
  subject: (data: Record<string, unknown>) => {
    const d = (data.daysLeft as number) ?? 7
    if (d <= 1) return '⚠️ Votre accès illimité expire demain'
    return `⏰ Votre accès illimité expire dans ${d} jours`
  },
  displayName: 'Accès illimité — expiration',
  previewData: {
    partnerFirstName: 'Marc',
    daysLeft: 7,
    expiresAt: new Date(Date.now() + 7 * 86400000).toISOString(),
    renewUrl: 'https://soumissioncomptable.com/recharger',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px 28px', maxWidth: '560px' }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: '#0f172a', margin: '0 0 20px' }
const text = { fontSize: '15px', color: '#334155', lineHeight: '1.6', margin: '0 0 16px' }
const button = {
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: 'bold' as const,
  borderRadius: '8px',
  padding: '14px 22px',
  textDecoration: 'none',
  display: 'inline-block',
  margin: '8px 0 20px',
}
const ps = { fontSize: '13px', color: '#64748b', margin: '24px 0 0' }