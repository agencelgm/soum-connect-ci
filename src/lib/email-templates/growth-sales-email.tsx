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
  subject?: string
  preview?: string
  bodyMarkdown?: string
  ctaLabel?: string
  ctaUrl?: string
}

/**
 * Convertit un markdown minimal (paragraphes séparés par \n\n, **gras**) en JSX inline safe.
 * On n'utilise jamais dangerouslySetInnerHTML : React échappe tout.
 */
function renderMarkdown(md: string): React.ReactNode {
  const paragraphs = md.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)
  return paragraphs.map((para, i) => {
    const parts = para.split(/(\*\*[^*]+\*\*)/g)
    return (
      <Text key={i} style={text}>
        {parts.map((chunk, j) => {
          if (chunk.startsWith('**') && chunk.endsWith('**')) {
            return <strong key={j}>{chunk.slice(2, -2)}</strong>
          }
          return <React.Fragment key={j}>{chunk}</React.Fragment>
        })}
      </Text>
    )
  })
}

const Email = ({
  partnerFirstName = 'Partenaire',
  preview = '',
  bodyMarkdown = '',
  ctaLabel = 'Recharger mon compte',
  ctaUrl = 'https://www.soumissioncomptable.com/connexion',
}: Props) => (
  <Html lang="fr" dir="ltr">
    <Head />
    <Preview>{preview}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={hello}>Bonjour {partnerFirstName},</Text>
        {renderMarkdown(bodyMarkdown)}
        <Button style={button} href={ctaUrl}>
          {ctaLabel}
        </Button>
        <Text style={signoff}>
          L'équipe Soumission Comptable
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (data: Record<string, unknown>) =>
    (data.subject as string) || 'Un message de Soumission Comptable',
  displayName: 'Growth — email de vente hebdomadaire',
  previewData: {
    partnerFirstName: 'Marc',
    subject: '50 prospects pour le prix d\'une pub Facebook ratée',
    preview: '10 000 FCFA sur Meta = 5 formulaires. Ici = 50 prospects qualifiés.',
    bodyMarkdown:
      "Vous avez déjà lancé une pub Facebook pour votre cabinet ? Alors vous savez : **10 000 FCFA sur Meta, c'est 3 à 6 formulaires**, souvent des curieux, des mauvais numéros, ou des gens hors zone.\n\nSur Soumission Comptable, ces **mêmes 10 000 FCFA vous donnent 50 prospects qualifiés** : service précisé, budget déclaré, ville confirmée. Chaque prospect est plafonné à 5 cabinets — pas 500 comme sur Meta.\n\nÇa fait **200 FCFA par prospect qualifié**. Le meilleur ratio du marché à Abidjan aujourd'hui.",
    ctaLabel: 'Recharger mon compte',
    ctaUrl: 'https://www.soumissioncomptable.com/connexion?next=%2Frecharger',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '28px 28px', maxWidth: '560px' }
const hello = { fontSize: '15px', color: '#0f172a', margin: '0 0 20px', fontWeight: 'bold' as const }
const text = { fontSize: '15px', color: '#334155', lineHeight: '1.7', margin: '0 0 16px' }
const button = {
  backgroundColor: '#0f766e',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: 'bold' as const,
  borderRadius: '8px',
  padding: '14px 22px',
  textDecoration: 'none',
  display: 'inline-block',
  margin: '12px 0 24px',
}
const signoff = { fontSize: '14px', color: '#64748b', margin: '20px 0 0' }