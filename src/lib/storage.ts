import type { LanguageId, Locale, Theme } from '../types'
import { isLanguageId } from './languages'

export const STORAGE_KEY = 'difflab:v1'

/** Approximate UTF-16 budget, safely below the typical 5 MB localStorage quota. */
export const MAX_PERSIST_BYTES = 4 * 1024 * 1024

export interface PersistedState {
  version: 1
  left: string
  right: string
  leftFileName: string | null
  rightFileName: string | null
  language: LanguageId
  ignoreWhitespace: boolean
  locale: Locale
  theme: Theme
}

export type SaveResult = 'saved' | 'too-large' | 'error'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function loadPersistedState(): PersistedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    const value: unknown = JSON.parse(raw)
    if (!isRecord(value) || value.version !== 1) return null

    return {
      version: 1,
      left: typeof value.left === 'string' ? value.left : '',
      right: typeof value.right === 'string' ? value.right : '',
      leftFileName: typeof value.leftFileName === 'string' ? value.leftFileName : null,
      rightFileName: typeof value.rightFileName === 'string' ? value.rightFileName : null,
      language: isLanguageId(value.language) ? value.language : 'text',
      ignoreWhitespace: value.ignoreWhitespace === true,
      locale: value.locale === 'en' ? 'en' : 'es',
      theme: value.theme === 'light' ? 'light' : 'dark',
    }
  } catch {
    return null
  }
}

export function estimatePersistedBytes(state: PersistedState): number {
  try {
    return JSON.stringify(state).length * 2
  } catch {
    return Number.POSITIVE_INFINITY
  }
}

export function savePersistedState(state: PersistedState): SaveResult {
  try {
    if (estimatePersistedBytes(state) > MAX_PERSIST_BYTES) {
      return 'too-large'
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    return 'saved'
  } catch {
    return 'error'
  }
}
