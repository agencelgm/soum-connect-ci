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
  videoTitle?: string
  videoDescription?: string
  videoDuration?: string
  videoUrl?: string
  dayIndex?: number
  totalVideos?: number
}

const Email = ({
  partnerFirstName = 'Partenaire',
  videoTitle = "Vidéo de l'Académie",
  videoDescription = 'Une nouvelle vidéo pour vous aider à convertir vos prospects.',
  videoDuration = '',
  videoUrl = 'https://www.soumissioncomptable.com/academie',
  dayIndex = 1,
  totalVideos = 4,
}: Props) => (
  <Html lang="fr" dir="ltr">
    <Head />
    <Preview>{`Jour ${dayIndex} — ${videoTitle}`}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={eyebrow}>Académie LGM · Jour {dayIndex} sur {totalVideos}</Text>
        <Heading style={h1}>{videoTitle}</Heading>
        <Text style={text}>Bonjour {partnerFirstName},</Text>
        <Text style={text}>{videoDescription}</Text>
        {videoDuration ? <Text style={meta}>Durée : {videoDuration}</Text> : null}
        <Button style={button} href={videoUrl}>
          Regarder la vidéo
        </Button>
        <Text style={ps}>
          Objectif : mieux comprendre Soumission Comptable et transformer plus
          de prospects en clients. Une vidéo par jour, courte et concrète.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (data: Record<string, unknown>) => {
    const title = (data.videoTitle as string) || "Nouvelle vidéo de l'Académie"
    const day = Number(data.dayIndex ?? 1)
    return `Jour ${day} — ${title}`
  },
  displayName: 'Académie — vidéo quotidienne',
  previewData: {
    partnerFirstName: 'Marc',
    videoTitle: 'Prospect vs client : les 3 étapes avant la vente',
    videoDescription:
      "La différence entre un prospect et un client, et comment adapter votre discours à chaque étape.",
    videoDuration: '10 min',
    videoUrl: 'https://www.soumissioncomptable.com/academie/vente/prospect-vs-client',
    dayIndex: 2,
    totalVideos: 4,
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px 28px', maxWidth: '560px' }
const eyebrow = {
  fontSize: '12px',
  color: '#0f766e',
  fontWeight: 'bold' as const,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  margin: '0 0 8px',
}
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: '#0f172a', margin: '0 0 20px' }
const text = { fontSize: '15px', color: '#334155', lineHeight: '1.6', margin: '0 0 16px' }
const meta = { fontSize: '13px', color: '#64748b', margin: '0 0 16px' }
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