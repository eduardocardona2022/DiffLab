import type { MessageKey } from '../i18n/translate'
import type { LanguageId } from '../types'

export const LANGUAGE_OPTIONS: readonly LanguageId[] = [
  'text',
  'json',
  'sql',
  'javascript',
  'typescript',
]

export const LANGUAGE_LABEL_KEY: Record<LanguageId, MessageKey> = {
  text: 'language.text',
  json: 'language.json',
  sql: 'language.sql',
  javascript: 'language.javascript',
  typescript: 'language.typescript',
}

export const MONACO_LANGUAGE: Record<LanguageId, string> = {
  text: 'plaintext',
  json: 'json',
  sql: 'sql',
  javascript: 'javascript',
  typescript: 'typescript',
}

export const LANGUAGE_EXTENSION: Record<LanguageId, string> = {
  text: 'txt',
  json: 'json',
  sql: 'sql',
  javascript: 'js',
  typescript: 'ts',
}

const EXTENSION_TO_LANGUAGE: Record<string, LanguageId> = {
  txt: 'text',
  text: 'text',
  md: 'text',
  log: 'text',
  csv: 'text',
  xml: 'text',
  yml: 'text',
  yaml: 'text',
  json: 'json',
  jsonc: 'json',
  sql: 'sql',
  js: 'javascript',
  mjs: 'javascript',
  cjs: 'javascript',
  jsx: 'javascript',
  ts: 'typescript',
  tsx: 'typescript',
  mts: 'typescript',
  cts: 'typescript',
}

export function languageFromFileName(fileName: string): LanguageId | null {
  const dot = fileName.lastIndexOf('.')
  if (dot < 0 || dot === fileName.length - 1) return null
  const extension = fileName.slice(dot + 1).toLowerCase()
  return EXTENSION_TO_LANGUAGE[extension] ?? null
}

export function isLanguageId(value: unknown): value is LanguageId {
  return typeof value === 'string' && LANGUAGE_OPTIONS.includes(value as LanguageId)
}
