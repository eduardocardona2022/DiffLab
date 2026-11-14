import type { LanguageId } from '../types'
import { LANGUAGE_EXTENSION } from './languages'

export function buildDownloadFileName(
  side: 'original' | 'modified',
  loadedName: string | null,
  language: LanguageId,
): string {
  if (loadedName) return loadedName
  return `difflab-${side}.${LANGUAGE_EXTENSION[language]}`
}

export function downloadText(text: string, fileName: string): void {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName
  anchor.style.display = 'none'
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}
