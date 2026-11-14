export const MAX_FILE_SIZE = 5 * 1024 * 1024

export type FileReadError = 'too-large' | 'binary' | 'read-error'

export type FileReadResult =
  | { ok: true; name: string; text: string }
  | { ok: false; name: string; error: FileReadError }

export async function readTextFile(file: File): Promise<FileReadResult> {
  if (file.size > MAX_FILE_SIZE) {
    return { ok: false, name: file.name, error: 'too-large' }
  }

  try {
    const text = await file.text()
    if (text.includes('\u0000')) {
      return { ok: false, name: file.name, error: 'binary' }
    }
    return { ok: true, name: file.name, text }
  } catch {
    return { ok: false, name: file.name, error: 'read-error' }
  }
}
