import * as monaco from 'monaco-editor'
import editorWorker from 'monaco-editor/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/language/json/json.worker?worker'
import tsWorker from 'monaco-editor/language/typescript/ts.worker?worker'

interface MonacoWorkerEnvironment {
  getWorker(workerId: string, label: string): Worker
}

;(self as unknown as { MonacoEnvironment: MonacoWorkerEnvironment }).MonacoEnvironment = {
  getWorker(_workerId, label) {
    if (label === 'json') return new jsonWorker()
    if (label === 'typescript' || label === 'javascript') return new tsWorker()
    return new editorWorker()
  },
}

export const MONACO_FONT_FAMILY =
  "'JetBrains Mono Variable', 'JetBrains Mono', 'Cascadia Code', ui-monospace, monospace"

monaco.editor.defineTheme('difflab-dark', {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'comment', foreground: '64748b', fontStyle: 'italic' },
    { token: 'keyword', foreground: 'a5b4fc' },
    { token: 'string', foreground: '86efac' },
    { token: 'number', foreground: 'fbbf24' },
    { token: 'type', foreground: '67e8f9' },
    { token: 'delimiter', foreground: '94a3b8' },
  ],
  colors: {
    'editor.background': '#0b1120',
    'editor.foreground': '#e2e8f0',
    'editorLineNumber.foreground': '#475569',
    'editorLineNumber.activeForeground': '#cbd5e1',
    'editor.lineHighlightBackground': '#1e293b80',
    'editor.selectionBackground': '#4f46e566',
    'editor.inactiveSelectionBackground': '#4f46e533',
    'editorCursor.foreground': '#a5b4fc',
    'editorIndentGuide.background1': '#1e293b',
    'editorIndentGuide.activeBackground1': '#334155',
    'editorGutter.background': '#0b1120',
    'editorWidget.background': '#0f172a',
    'editorWidget.border': '#1e293b',
    'editorSuggestWidget.background': '#0f172a',
    'editorSuggestWidget.border': '#1e293b',
    'diffEditor.insertedTextBackground': '#22c55e26',
    'diffEditor.removedTextBackground': '#ef444426',
    'diffEditor.insertedLineBackground': '#22c55e14',
    'diffEditor.removedLineBackground': '#ef444414',
    'diffEditor.border': '#1e293b',
    'diffEditor.diagonalFill': '#1e293b66',
    'scrollbarSlider.background': '#47556955',
    'scrollbarSlider.hoverBackground': '#47556988',
    'scrollbarSlider.activeBackground': '#94a3b8aa',
    'minimap.background': '#0b1120',
    'overviewRulerBorder': '#00000000',
  },
})

monaco.editor.defineTheme('difflab-light', {
  base: 'vs',
  inherit: true,
  rules: [
    { token: 'comment', foreground: '94a3b8', fontStyle: 'italic' },
    { token: 'keyword', foreground: '4338ca' },
    { token: 'string', foreground: '047857' },
    { token: 'number', foreground: 'b45309' },
    { token: 'type', foreground: '0e7490' },
    { token: 'delimiter', foreground: '64748b' },
  ],
  colors: {
    'editor.background': '#ffffff',
    'editor.foreground': '#1e293b',
    'editorLineNumber.foreground': '#94a3b8',
    'editorLineNumber.activeForeground': '#475569',
    'editor.lineHighlightBackground': '#f1f5f9',
    'editor.selectionBackground': '#c7d2fe99',
    'editor.inactiveSelectionBackground': '#c7d2fe55',
    'editorCursor.foreground': '#4f46e5',
    'editorIndentGuide.background1': '#eef2f7',
    'editorIndentGuide.activeBackground1': '#cbd5e1',
    'editorGutter.background': '#ffffff',
    'editorWidget.background': '#ffffff',
    'editorWidget.border': '#e2e8f0',
    'editorSuggestWidget.background': '#ffffff',
    'editorSuggestWidget.border': '#e2e8f0',
    'diffEditor.insertedTextBackground': '#22c55e22',
    'diffEditor.removedTextBackground': '#ef444422',
    'diffEditor.insertedLineBackground': '#22c55e10',
    'diffEditor.removedLineBackground': '#ef444410',
    'diffEditor.border': '#e2e8f0',
    'diffEditor.diagonalFill': '#e2e8f066',
    'scrollbarSlider.background': '#94a3b855',
    'scrollbarSlider.hoverBackground': '#94a3b888',
    'scrollbarSlider.activeBackground': '#64748baa',
    'minimap.background': '#ffffff',
    'overviewRulerBorder': '#00000000',
  },
})

monaco.typescript.typescriptDefaults.setDiagnosticsOptions({
  noSemanticValidation: true,
  noSyntaxValidation: false,
})

monaco.typescript.javascriptDefaults.setDiagnosticsOptions({
  noSemanticValidation: true,
  noSyntaxValidation: false,
})

monaco.json.jsonDefaults.setDiagnosticsOptions({
  validate: true,
  allowComments: false,
  trailingCommas: 'error',
})

const initialTheme =
  document.documentElement.dataset.theme === 'light' ? 'difflab-light' : 'difflab-dark'
monaco.editor.setTheme(initialTheme)

if (typeof document.fonts !== 'undefined') {
  void document.fonts.ready.then(() => monaco.editor.remeasureFonts())
}

export { monaco }
