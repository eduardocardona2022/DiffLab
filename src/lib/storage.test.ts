import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  estimatePersistedBytes,
  loadPersistedState,
  MAX_PERSIST_BYTES,
  savePersistedState,
  STORAGE_KEY,
  type PersistedState,
} from './storage'

const baseState: PersistedState = {
  version: 1,
  left: 'const a = 1',
  right: 'const a = 2',
  leftFileName: null,
  rightFileName: null,
  language: 'typescript',
  ignoreWhitespace: false,
  locale: 'es',
  theme: 'dark',
}

beforeEach(() => {
  localStorage.clear()
  vi.restoreAllMocks()
})

describe('storage', () => {
  it('round-trips the persisted state', () => {
    expect(savePersistedState(baseState)).toBe('saved')
    expect(loadPersistedState()).toEqual(baseState)
  })

  it('returns null for invalid or missing data', () => {
    expect(loadPersistedState()).toBeNull()
    localStorage.setItem(STORAGE_KEY, 'not json')
    expect(loadPersistedState()).toBeNull()
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 2 }))
    expect(loadPersistedState()).toBeNull()
  })

  it('sanitizes invalid fields', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 1,
        left: 42,
        right: null,
        language: 'python',
        locale: 'fr',
        theme: 'blue',
        ignoreWhitespace: 'yes',
      }),
    )

    expect(loadPersistedState()).toEqual({
      version: 1,
      left: '',
      right: '',
      leftFileName: null,
      rightFileName: null,
      language: 'text',
      ignoreWhitespace: false,
      locale: 'es',
      theme: 'dark',
    })
  })

  it('refuses to persist oversized content', () => {
    const state: PersistedState = {
      ...baseState,
      left: 'x'.repeat(MAX_PERSIST_BYTES / 2 + 100),
    }

    expect(estimatePersistedBytes(state)).toBeGreaterThan(MAX_PERSIST_BYTES)
    expect(savePersistedState(state)).toBe('too-large')
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })

  it('reports quota or serialization errors', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError')
    })

    expect(savePersistedState(baseState)).toBe('error')
  })
})
