import { describe, expect, it } from 'vitest'
import { isLanguageId, languageFromFileName } from './languages'

describe('languageFromFileName', () => {
  it('maps the supported extensions', () => {
    expect(languageFromFileName('notes.txt')).toBe('text')
    expect(languageFromFileName('data.json')).toBe('json')
    expect(languageFromFileName('query.sql')).toBe('sql')
    expect(languageFromFileName('app.js')).toBe('javascript')
    expect(languageFromFileName('app.ts')).toBe('typescript')
  })

  it('is case insensitive and handles JSX/TSX', () => {
    expect(languageFromFileName('DATA.JSON')).toBe('json')
    expect(languageFromFileName('Component.TSX')).toBe('typescript')
    expect(languageFromFileName('script.jsx')).toBe('javascript')
  })

  it('returns null when there is no usable extension', () => {
    expect(languageFromFileName('README')).toBeNull()
    expect(languageFromFileName('file.')).toBeNull()
    expect(languageFromFileName('archive.zip')).toBeNull()
  })
})

describe('isLanguageId', () => {
  it('accepts known ids only', () => {
    expect(isLanguageId('typescript')).toBe(true)
    expect(isLanguageId('sql')).toBe(true)
    expect(isLanguageId('python')).toBe(false)
    expect(isLanguageId(null)).toBe(false)
  })
})
