import * as React from 'react'
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Breach {
  scope: string
  metric: 'bounce' | 'complaint'
  rate: number
  volume: number
  failed: number
}

interface Props {
  breaches?: Breach[]
  windowHours?: number
  threshold?: number
  dashboardUrl?: string
}

const Email = ({
  breaches = [],
  windowHours = 24,
  threshold = 3,
  dashboardUrl = 'https://www.soumissioncomptable.com/admin?tab=emails',
}: Props) => {
  return (
    <Html lang="fr" dir="ltr">
      <Head />
      <Preview>Alerte : taux de rebonds / plaintes {'>'} {threshold}%</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>🚨 Alerte santé emails</Heading>
          <Text style={text}>
            Sur les dernières <strong>{windowHours} heures</strong>, un ou plusieurs
            seuils critiques ont été franchis (seuil : <strong>{threshold}%</strong>).
          </Text>
          <Section style={box}>
            {breaches.map((b, i) => (
              <Text key={i} style={row}>
                <strong>
                  {b.metric === 'bounce' ? '↩️ Rebonds' : '🚫 Plaintes spam'}
                </strong>{' '}
                — <em>{b.scope === 'GLOBAL' ? 'Global' : `Modèle : ${b.scope}`}</em>
                <br />
                Taux : <strong style={{ color: '#b91c1c' }}>{b.rate.toFixed(2)}%</strong>{' '}
                ({b.failed}/{b.volume} emails)
              </Text>
            ))}
          </Section>
          <Text style={text}>
            Actions recommandées : vérifiez la liste d'exclusion, la qualité des
            adresses (formulaires, imports) et le contenu des modèles concernés.
          </Text>
          <Button style={button} href={dashboardUrl}>
            Ouvrir le tableau de bord emails
          </Button>
          <Text style={ps}>
            Cette alerte est envoyée au maximum une fois par 12 heures pour le
            même couple (métrique, modèle).
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: Email,
  subject: (data: Record<string, unknown>) => {
    const list = (data.breaches as Breach[] | undefined) ?? []
    const worst = list.reduce((m, b) => (b.rate > m ? b.rate : m), 0)
    return `🚨 Alerte emails : ${worst.toFixed(1)}% de rebonds/plaintes détectés`
  },
  displayName: 'Alerte santé emails',
  previewData: {
    windowHours: 24,
    threshold: 3,
    dashboardUrl: 'https://www.soumissioncomptable.com/admin?tab=emails',
    breaches: [
      { scope: 'GLOBAL', metric: 'bounce', rate: 4.2, volume: 120, failed: 5 },
      { scope: 'new-prospect', metric: 'complaint', rate: 3.5, volume: 85, failed: 3 },
    ],
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px 28px', maxWidth: '600px' }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: '#0f172a', margin: '0 0 20px' }
const text = { fontSize: '15px', color: '#334155', lineHeight: '1.6', margin: '0 0 16px' }
const box = {
  backgroundColor: '#fef2f2',
  border: '1px solid #fecaca',
  borderRadius: '8px',
  padding: '16px 18px',
  margin: '16px 0',
}
const row = { fontSize: '14px', color: '#0f172a', lineHeight: '1.6', margin: '0 0 12px' }
const button = {
  color: '#ffffff',
  backgroundColor: '#b91c1c',
  fontSize: '15px',
  fontWeight: 'bold' as const,
  borderRadius: '8px',
  padding: '14px 22px',
  textDecoration: 'none',
  display: 'inline-block',
  margin: '8px 0 20px',
}
const ps = { fontSize: '12px', color: '#64748b', margin: '20px 0 0' }