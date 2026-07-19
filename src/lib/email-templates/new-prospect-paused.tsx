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
  prospectFirstName?: string
  service?: string
  city?: string
  message?: string | null
  creditsBalance?: number
  hasUnlimited?: boolean
  unlimitedUntil?: string | null
  loginUrl?: string
  rechargeUrl?: string
}

const Email = ({
  partnerFirstName = 'Partenaire',
  prospectFirstName = 'Un prospect',
  service = 'un service comptable',
  city,
  message,
  creditsBalance = 0,
  hasUnlimited = false,
  unlimitedUntil = null,
  loginUrl = 'https://www.soumissioncomptable.com/connexion',
  rechargeUrl = 'https://www.soumissioncomptable.com/connexion',
}: Props) => {
  const hasCredits = creditsBalance > 0
  const canUnlock = hasCredits || hasUnlimited
  const unlimitedDate = unlimitedUntil
    ? new Date(unlimitedUntil).toLocaleDateString('fr-FR', {
        day: 'numeric', month: 'long', year: 'numeric',
      })
    : null
  return (
  <Html lang="fr" dir="ltr">
    <Head />
    <Preview>{canUnlock
      ? `Vous avez ${hasUnlimited ? 'un accès illimité actif' : `${creditsBalance} crédit${creditsBalance > 1 ? 's' : ''}`} — ${prospectFirstName} vous attend`
      : `${prospectFirstName} vous attend — reconnectez-vous pour ne pas passer à côté`}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>{canUnlock ? "Vous n'avez rien à perdre." : `${prospectFirstName} vous attend.`}</Heading>
        <Text style={text}>Bonjour {partnerFirstName},</Text>
        <Text style={text}>
          <strong>{prospectFirstName}</strong> vient d'être approuvé{city ? <> à <strong>{city}</strong></> : null} et
          recherche : <strong>{service}</strong>.
        </Text>
        {message ? (
          <div style={quote}>
            <p style={quoteLabel}>Message du prospect :</p>
            <p style={quoteText}>« {message} »</p>
          </div>
        ) : null}
        {hasUnlimited ? (
          <div style={callout}>
            Votre <strong>accès illimité</strong> est encore actif
            {unlimitedDate ? <> jusqu'au <strong>{unlimitedDate}</strong></> : null} —
            vous pouvez débloquer ce prospect sans dépenser de crédit.
          </div>
        ) : hasCredits ? (
          <div style={callout}>
            Il vous reste <strong>{creditsBalance} crédit{creditsBalance > 1 ? 's' : ''}</strong> déjà
            payés sur votre compte.
          </div>
        ) : (
          <div style={calloutWarn}>
            Votre compte est en pause et votre solde est à <strong>0 crédit</strong>.
            Rechargez en 2 minutes et vous êtes de nouveau dans la course.
          </div>
        )}
        <Text style={text}>
          Votre compte est en pause (14 jours sans connexion), mais vos crédits et
          votre historique sont préservés. Reconnectez-vous : notre équipe réactive
          votre compte dès que vous nous le demandez.
        </Text>
        {canUnlock ? (
          <Button style={button} href={loginUrl}>
            Me reconnecter et débloquer
          </Button>
        ) : (
          <>
            <Button style={buttonWarn} href={rechargeUrl}>
              Recharger et rattraper ce prospect
            </Button>
            <Text style={secondaryLink}>
              Ou <a href={loginUrl} style={link}>connectez-vous d'abord</a> pour voir la fiche.
            </Text>
          </>
        )}
        <Text style={ps}>
          <strong>P.S.</strong> Seuls 5 partenaires peuvent débloquer ce prospect.
          Passé ce cap, l'opportunité est perdue.
        </Text>
      </Container>
    </Body>
  </Html>
)}

export const template = {
  component: Email,
  subject: (data: Record<string, unknown>) => {
    const name = (data.prospectFirstName as string) || 'Un nouveau prospect'
    const credits = Number(data.creditsBalance ?? 0)
    return `${name} vous attend — vous avez ${credits} crédit${credits > 1 ? 's' : ''} inutilisés`
  },
  displayName: 'Nouveau prospect — partenaire en pause',
  previewData: {
    partnerFirstName: 'Marc',
    prospectFirstName: 'Awa',
    service: "Création d'entreprise",
    city: 'Abidjan',
    creditsBalance: 12,
    loginUrl: 'https://www.soumissioncomptable.com/connexion',
    rechargeUrl: 'https://www.soumissioncomptable.com/connexion',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px 28px', maxWidth: '560px' }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: '#0f172a', margin: '0 0 20px' }
const text = { fontSize: '15px', color: '#334155', lineHeight: '1.6', margin: '0 0 16px' }
const callout = {
  backgroundColor: '#ecfdf5',
  border: '1px solid #10b981',
  color: '#065f46',
  padding: '12px 16px',
  borderRadius: '8px',
  margin: '0 0 16px',
  fontSize: '15px',
}
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
const buttonWarn = { ...button, backgroundColor: '#dc2626' }
const calloutWarn = {
  backgroundColor: '#fef2f2',
  border: '1px solid #dc2626',
  color: '#991b1b',
  padding: '12px 16px',
  borderRadius: '8px',
  margin: '0 0 16px',
  fontSize: '15px',
}
const secondaryLink = { fontSize: '13px', color: '#64748b', margin: '0 0 12px' }
const link = { color: '#0f766e', textDecoration: 'underline' }
const ps = { fontSize: '13px', color: '#64748b', margin: '24px 0 0', fontStyle: 'italic' as const }
const quote = {
  backgroundColor: '#f8fafc',
  borderLeft: '3px solid #0f766e',
  padding: '12px 16px',
  borderRadius: '6px',
  margin: '0 0 16px',
}
const quoteLabel = {
  fontSize: '11px',
  fontWeight: 'bold' as const,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.06em',
  color: '#0f766e',
  margin: '0 0 6px',
}
const quoteText = {
  fontSize: '14px',
  color: '#334155',
  lineHeight: '1.6',
  fontStyle: 'italic' as const,
  margin: 0,
}