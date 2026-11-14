import type { Locale } from '../types'
import { en } from './en'
import { es } from './es'

export type MessageKey = keyof typeof es
export type MessageVars = Record<string, string | number>

const DICTIONARIES = { es, en } as const

export function translate(
  locale: Locale,
  key: MessageKey,
  vars?: MessageVars,
): string {
  const template = DICTIONARIES[locale][key]
  if (!vars) return template

  return Object.entries(vars).reduce(
    (message, [name, value]) => message.replaceAll(`{${name}}`, String(value)),
    template,
  )
}
