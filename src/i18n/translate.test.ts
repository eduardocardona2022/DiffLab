import { describe, expect, it } from 'vitest'
import { en } from './en'
import { es } from './es'
import { translate } from './translate'

describe('dictionaries', () => {
  it('keeps the same keys in Spanish and English', () => {
    expect(Object.keys(en).sort()).toEqual(Object.keys(es).sort())
  })

  it('has no empty messages', () => {
    for (const message of [...Object.values(es), ...Object.values(en)]) {
      expect(message.trim().length).toBeGreaterThan(0)
    }
  })
})

describe('translate', () => {
  it('returns the localized message', () => {
    expect(translate('es', 'panel.original')).toBe('Original')
    expect(translate('en', 'panel.modified')).toBe('Modified')
  })

  it('interpolates variables', () => {
    expect(translate('es', 'stats.changes', { count: 12 })).toBe('12 cambios')
    expect(translate('en', 'toast.loaded', { name: 'data.json' })).toBe(
      'File loaded: data.json',
    )
  })
})
