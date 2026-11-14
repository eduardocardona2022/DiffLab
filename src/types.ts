export type Locale = 'es' | 'en'

export type Theme = 'light' | 'dark'

export type Side = 'original' | 'modified'

export type LanguageId = 'text' | 'json' | 'sql' | 'javascript' | 'typescript'

export interface DiffStats {
  changes: number
  added: number
  removed: number
}

export interface TextMetrics {
  lines: number
  characters: number
  bytes: number
}

export interface ToastMessage {
  id: number
  type: 'success' | 'error' | 'info'
  message: string
}
