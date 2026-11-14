import { describe, expect, it } from 'vitest'
import { computeDiffStats, type LineChangeLike } from './diff'

function change(
  originalStart: number,
  originalEnd: number,
  modifiedStart: number,
  modifiedEnd: number,
): LineChangeLike {
  return {
    originalStartLineNumber: originalStart,
    originalEndLineNumber: originalEnd,
    modifiedStartLineNumber: modifiedStart,
    modifiedEndLineNumber: modifiedEnd,
  }
}

describe('computeDiffStats', () => {
  it('returns zeros without changes', () => {
    expect(computeDiffStats(null)).toEqual({
      changes: 0,
      added: 0,
      removed: 0,
    })
    expect(computeDiffStats([])).toEqual({
      changes: 0,
      added: 0,
      removed: 0,
    })
  })

  it('counts inserted lines only', () => {
    expect(computeDiffStats([change(0, 0, 2, 4)])).toEqual({
      changes: 1,
      added: 3,
      removed: 0,
    })
  })

  it('counts removed lines only', () => {
    expect(computeDiffStats([change(5, 6, 0, 0)])).toEqual({
      changes: 1,
      added: 0,
      removed: 2,
    })
  })

  it('counts replaced lines and totals blocks', () => {
    expect(
      computeDiffStats([
        change(2, 3, 2, 3),
        change(10, 12, 11, 11),
      ]),
    ).toEqual({
      changes: 2,
      added: 3,
      removed: 5,
    })
  })
})
