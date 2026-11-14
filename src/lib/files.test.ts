import { describe, expect, it, vi } from 'vitest'
import { MAX_FILE_SIZE, readTextFile } from './files'

function fakeFile(
  content: string,
  options: { name?: string; size?: number; reject?: boolean } = {},
): File {
  const file = {
    name: options.name ?? 'example.txt',
    size: options.size ?? new TextEncoder().encode(content).length,
    text: async () => {
      if (options.reject) throw new Error('read failed')
      return content
    },
  }

  return file as File
}

describe('readTextFile', () => {
  it('reads plain text', async () => {
    await expect(readTextFile(fakeFile('hello'))).resolves.toEqual({
      ok: true,
      name: 'example.txt',
      text: 'hello',
    })
  })

  it('rejects files above the size limit without reading them', async () => {
    const text = vi.fn(async () => 'should not run')
    const file = {
      name: 'huge.log',
      size: MAX_FILE_SIZE + 1,
      text,
    } as unknown as File

    await expect(readTextFile(file)).resolves.toEqual({
      ok: false,
      name: 'huge.log',
      error: 'too-large',
    })
    expect(text).not.toHaveBeenCalled()
  })

  it('rejects binary content', async () => {
    await expect(readTextFile(fakeFile('abc\u0000def'))).resolves.toEqual({
      ok: false,
      name: 'example.txt',
      error: 'binary',
    })
  })

  it('reports read failures', async () => {
    await expect(readTextFile(fakeFile('', { reject: true }))).resolves.toEqual({
      ok: false,
      name: 'example.txt',
      error: 'read-error',
    })
  })
})
