import type { ComponentType } from 'react'

export interface TemplateEntry {
  component: ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  displayName?: string
  previewData?: Record<string, any>
  /** Fixed recipient — overrides caller-provided recipientEmail when set. */
  to?: string
}

import { template as newProspect } from './new-prospect'
import { template as unlimitedExpiring } from './unlimited-expiring'
import { template as newProspectPaused } from './new-prospect-paused'
import { template as pendingDocsReminder } from './pending-docs-reminder'
import { template as academyDrip } from './academy-drip'
import { template as emailHealthAlert } from './email-health-alert'
import { template as newProspectsDigest } from './new-prospects-digest'
import { template as growthSalesEmail } from './growth-sales-email'
import { template as promo50pctVariantA } from './promo-50pct-variant-a'
import { template as promo50pctVariantB } from './promo-50pct-variant-b'
import { template as promoWinbackMorning } from './promo-winback-morning'
import { template as promoWinbackAfternoon } from './promo-winback-afternoon'
import { template as promoWinbackEvening } from './promo-winback-evening'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'new-prospect': newProspect,
  'unlimited-expiring': unlimitedExpiring,
  'new-prospect-paused': newProspectPaused,
  'pending-docs-reminder': pendingDocsReminder,
  'academy-drip': academyDrip,
  'email-health-alert': emailHealthAlert,
  'new-prospects-digest': newProspectsDigest,
  'growth-sales-email': growthSalesEmail,
  'promo-50pct-variant-a': promo50pctVariantA,
  'promo-50pct-variant-b': promo50pctVariantB,
  'promo-winback-morning': promoWinbackMorning,
  'promo-winback-afternoon': promoWinbackAfternoon,
  'promo-winback-evening': promoWinbackEvening,
}
