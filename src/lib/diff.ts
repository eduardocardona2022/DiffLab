import type { DiffStats } from '../types'

export interface LineChangeLike {
  originalStartLineNumber: number
  originalEndLineNumber: number
  modifiedStartLineNumber: number
  modifiedEndLineNumber: number
}

function countLines(start: number, end: number): number {
  if (start <= 0 || end < start) return 0
  return end - start + 1
}

export function computeDiffStats(
  changes: readonly LineChangeLike[] | null | undefined,
): DiffStats {
  if (!changes || changes.length === 0) {
    return { changes: 0, added: 0, removed: 0 }
  }

  let added = 0
  let removed = 0

  for (const change of changes) {
    added += countLines(change.modifiedStartLineNumber, change.modifiedEndLineNumber)
    removed += countLines(change.originalStartLineNumber, change.originalEndLineNumber)
  }

  return { changes: changes.length, added, removed }
}
