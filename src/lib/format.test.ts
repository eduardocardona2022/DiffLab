import { describe, expect, it } from 'vitest'
import { byteLength, countLines, formatBytes, getTextMetrics } from './format'

describe('formatBytes', () => {
  it('formats bytes, kilobytes and megabytes per locale', () => {
    expect(formatBytes(0, 'es')).toBe('0 B')
    expect(formatBytes(900, 'en')).toBe('900 B')
    expect(formatBytes(1536, 'es')).toBe('1,5 KB')
    expect(formatBytes(1536, 'en')).toBe('1.5 KB')
    expect(formatBytes(2 * 1024 * 1024, 'en')).toBe('2 MB')
  })
})

describe('countLines', () => {
  it('handles empty and multi-line text', () => {
    expect(countLines('')).toBe(0)
    expect(countLines('one')).toBe(1)
    expect(countLines('one\ntwo')).toBe(2)
    expect(countLines('one\r\ntwo\r\n')).toBe(3)
  })
})

describe('getTextMetrics', () => {
  it('returns lines, characters and bytes', () => {
    expect(getTextMetrics('hola\nmundo')).toEqual({
      lines: 2,
      characters: 10,
      bytes: 10,
    })
  })

  it('counts UTF-8 bytes', () => {
    expect(byteLength('á')).toBe(2)
    expect(byteLength('😀')).toBe(4)
  })
})
