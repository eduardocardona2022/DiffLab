import type { Locale, TextMetrics } from '../types'

const LOCALE_TAGS: Record<Locale, string> = {
  es: 'es-ES',
  en: 'en-US',
}

export function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(LOCALE_TAGS[locale]).format(value)
}

export function formatBytes(bytes: number, locale: Locale): string {
  if (bytes < 1024) return `${formatNumber(bytes, locale)} B`

  const kilobytes = bytes / 1024
  if (kilobytes < 1024) {
    return `${new Intl.NumberFormat(LOCALE_TAGS[locale], {
      maximumFractionDigits: 1,
    }).format(kilobytes)} KB`
  }

  return `${new Intl.NumberFormat(LOCALE_TAGS[locale], {
    maximumFractionDigits: 1,
  }).format(kilobytes / 1024)} MB`
}

export function countLines(text: string): number {
  if (!text) return 0
  return text.split(/\r\n|\r|\n/).length
}

export function byteLength(text: string): number {
  return new TextEncoder().encode(text).length
}

export function getTextMetrics(text: string): TextMetrics {
  return {
    lines: countLines(text),
    characters: text.length,
    bytes: byteLength(text),
  }
}
