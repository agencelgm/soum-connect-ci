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

export const TEMPLATES: Record<string, TemplateEntry> = {
  'new-prospect': newProspect,
  'unlimited-expiring': unlimitedExpiring,
  'new-prospect-paused': newProspectPaused,
  'pending-docs-reminder': pendingDocsReminder,
  'academy-drip': academyDrip,
  'email-health-alert': emailHealthAlert,
}
