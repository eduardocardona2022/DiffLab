import type { MessageKey } from './translate'

export const en: Record<MessageKey, string> = {
  'app.title': 'DiffLab — Text diff',
  'app.subtitle': 'Text diff',

  'header.language': 'Language',
  'header.theme.toDark': 'Switch to dark theme',
  'header.theme.toLight': 'Switch to light theme',

  'toolbar.language': 'Language',
  'toolbar.ignore': 'Ignore edge whitespace',
  'toolbar.ignore.hint':
    'Do not flag spaces at the start or end of each line as differences.',
  'toolbar.swap': 'Swap',
  'toolbar.previous': 'Previous change',
  'toolbar.next': 'Next change',

  'stats.none': 'No changes',
  'stats.change': '1 change',
  'stats.changes': '{count} changes',
  'stats.addedTitle': 'Added lines',
  'stats.removedTitle': 'Removed lines',

  'panel.original': 'Original',
  'panel.modified': 'Modified',
  'panel.load': 'Load file',
  'panel.download': 'Download text',
  'panel.loadHint': 'Load a text file (max. 5 MB)',
  'panel.downloadHint': "Download this panel's content",

  'empty.title': 'Compare two texts',
  'empty.hint':
    'Paste content or drop a file onto either panel. You can also load one from here.',
  'empty.loadOriginal': 'Load original',
  'empty.loadModified': 'Load modified',

  'drop.original': 'Drop the file on the original panel',
  'drop.modified': 'Drop the file on the modified panel',
  'drop.hint': 'It will be loaded as text',

  'toast.loaded': 'File loaded: {name}',
  'toast.tooLarge': 'The file exceeds the 5 MB limit.',
  'toast.binary': 'The file looks binary and cannot be compared as text.',
  'toast.readError': 'The file could not be read.',
  'toast.persistTooLarge':
    'The content is too large to persist in the browser. It will be kept for this session only.',
  'toast.persistError': 'The state could not be saved in this browser.',
  'toast.dismiss': 'Dismiss notification',

  'status.lines': '{count} lines',
  'status.characters': '{count} characters',
  'status.privacy': 'Everything runs in your browser',

  'language.text': 'Text',
  'language.json': 'JSON',
  'language.sql': 'SQL Server (T-SQL)',
  'language.javascript': 'JavaScript',
  'language.typescript': 'TypeScript',
}
