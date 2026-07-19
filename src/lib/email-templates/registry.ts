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

export const TEMPLATES: Record<string, TemplateEntry> = {
  'new-prospect': newProspect,
  'unlimited-expiring': unlimitedExpiring,
}
