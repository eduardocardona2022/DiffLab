import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from 'react'
import type { Locale } from '../types'
import { translate, type MessageKey, type MessageVars } from './translate'

export type TranslateFn = (key: MessageKey, vars?: MessageVars) => string

interface I18nContextValue {
  locale: Locale
  t: TranslateFn
  formatNumber: (value: number) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({
  locale,
  children,
}: {
  locale: Locale
  children: ReactNode
}) {
  const value = useMemo<I18nContextValue>(() => {
    const numberFormatter = new Intl.NumberFormat(locale === 'es' ? 'es-ES' : 'en-US')
    return {
      locale,
      t: (key, vars) => translate(locale, key, vars),
      formatNumber: (number) => numberFormatter.format(number),
    }
  }, [locale])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18nContextValue {
  const value = useContext(I18nContext)
  if (!value) {
    throw new Error('useI18n must be used inside an I18nProvider')
  }
  return value
}
