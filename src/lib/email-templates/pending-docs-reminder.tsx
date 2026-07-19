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
  cabinetName?: string
  whatsappUrl?: string
}

const Email = ({
  partnerFirstName = 'Partenaire',
  cabinetName,
  whatsappUrl = 'https://wa.me/22505000000',
}: Props) => (
  <Html lang="fr" dir="ltr">
    <Head />
    <Preview>Il manque encore vos documents pour activer votre compte</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Votre compte est presque prêt</Heading>
        <Text style={text}>Bonjour {partnerFirstName},</Text>
        <Text style={text}>
          Nous n'avons pas encore reçu les documents nécessaires pour approuver
          {cabinetName ? <> le compte de <strong>{cabinetName}</strong></> : <> votre compte</>}.
          Tant que ces documents ne sont pas transmis, votre accès à la marketplace
          reste bloqué et vous ne recevez pas les nouveaux prospects.
        </Text>
        <Text style={text}>
          Envoyez-nous simplement vos documents sur WhatsApp — c'est le plus rapide,
          et notre équipe active votre compte dans la foulée.
        </Text>
        <Button style={button} href={whatsappUrl}>
          Envoyer mes documents sur WhatsApp
        </Button>
        <Text style={ps}>
          Vous recevez ce rappel tous les 3 jours tant que votre dossier est
          incomplet.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: 'Rappel : envoyez vos documents pour activer votre compte',
  displayName: 'Rappel documents (compte en attente)',
  previewData: {
    partnerFirstName: 'Marc',
    cabinetName: 'Cabinet Exemple',
    whatsappUrl: 'https://wa.me/22505000000',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px 28px', maxWidth: '560px' }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: '#0f172a', margin: '0 0 20px' }
const text = { fontSize: '15px', color: '#334155', lineHeight: '1.6', margin: '0 0 16px' }
const button = {
  backgroundColor: '#25D366',
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