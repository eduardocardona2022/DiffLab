import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react'
import type { editor } from 'monaco-editor'
import { computeDiffStats } from '../lib/diff'
import { MONACO_LANGUAGE } from '../lib/languages'
import { monaco, MONACO_FONT_FAMILY } from '../lib/monaco'
import type { DiffStats, LanguageId, Theme } from '../types'

export interface DiffViewerHandle {
  goToPrevious: () => void
  goToNext: () => void
}

interface DiffViewerProps {
  original: string
  modified: string
  language: LanguageId
  ignoreWhitespace: boolean
  theme: Theme
  onChangeOriginal: (value: string) => void
  onChangeModified: (value: string) => void
  onStatsChange: (stats: DiffStats) => void
}

export const DiffViewer = forwardRef<DiffViewerHandle, DiffViewerProps>(
  function DiffViewer(
    {
      original,
      modified,
      language,
      ignoreWhitespace,
      theme,
      onChangeOriginal,
      onChangeModified,
      onStatsChange,
    },
    ref,
  ) {
    const containerRef = useRef<HTMLDivElement>(null)
    const editorRef = useRef<editor.IStandaloneDiffEditor | null>(null)
    const originalModelRef = useRef<editor.ITextModel | null>(null)
    const modifiedModelRef = useRef<editor.ITextModel | null>(null)
    const lastOriginalRef = useRef(original)
    const lastModifiedRef = useRef(modified)

    const initialRef = useRef({ original, modified, language, ignoreWhitespace })
    const callbacksRef = useRef({
      onChangeOriginal,
      onChangeModified,
      onStatsChange,
    })

    callbacksRef.current = {
      onChangeOriginal,
      onChangeModified,
      onStatsChange,
    }

    useImperativeHandle(
      ref,
      () => ({
        goToPrevious: () => editorRef.current?.goToDiff('previous'),
        goToNext: () => editorRef.current?.goToDiff('next'),
      }),
      [],
    )

    useEffect(() => {
      const container = containerRef.current
      if (!container) return

      const initial = initialRef.current
      const originalModel = monaco.editor.createModel(
        initial.original,
        MONACO_LANGUAGE[initial.language],
      )
      const modifiedModel = monaco.editor.createModel(
        initial.modified,
        MONACO_LANGUAGE[initial.language],
      )

      const diffEditor = monaco.editor.createDiffEditor(container, {
        automaticLayout: true,
        originalEditable: true,
        readOnly: false,
        renderSideBySide: true,
        renderOverviewRuler: true,
        enableSplitViewResizing: true,
        ignoreTrimWhitespace: initial.ignoreWhitespace,
        minimap: { enabled: false },
        lineNumbers: 'on',
        glyphMargin: false,
        folding: true,
        fontFamily: MONACO_FONT_FAMILY,
        fontSize: 13,
        lineHeight: 21,
        fontLigatures: true,
        smoothScrolling: true,
        scrollBeyondLastLine: false,
        padding: { top: 12, bottom: 12 },
        wordWrap: 'off',
        diffWordWrap: 'off',
        contextmenu: true,
        fixedOverflowWidgets: true,
        renderLineHighlight: 'all',
        renderWhitespace: 'selection',
        bracketPairColorization: { enabled: true },
        guides: { indentation: true, bracketPairs: false },
        scrollbar: {
          verticalScrollbarSize: 10,
          horizontalScrollbarSize: 10,
          useShadows: false,
        },
        overviewRulerBorder: false,
        hideUnchangedRegions: { enabled: false },
      })

      diffEditor.setModel({ original: originalModel, modified: modifiedModel })
      editorRef.current = diffEditor
      originalModelRef.current = originalModel
      modifiedModelRef.current = modifiedModel
      lastOriginalRef.current = originalModel.getValue()
      lastModifiedRef.current = modifiedModel.getValue()

      let disposed = false

      const updateStats = () => {
        if (disposed) return
        callbacksRef.current.onStatsChange(
          computeDiffStats(diffEditor.getLineChanges()),
        )
      }

      const originalSubscription = originalModel.onDidChangeContent(() => {
        const value = originalModel.getValue()
        lastOriginalRef.current = value
        callbacksRef.current.onChangeOriginal(value)
      })

      const modifiedSubscription = modifiedModel.onDidChangeContent(() => {
        const value = modifiedModel.getValue()
        lastModifiedRef.current = value
        callbacksRef.current.onChangeModified(value)
      })

      const diffSubscription = diffEditor.onDidUpdateDiff(updateStats)
      const initialStatsTimer = window.setTimeout(updateStats, 0)

      return () => {
        disposed = true
        window.clearTimeout(initialStatsTimer)
        originalSubscription.dispose()
        modifiedSubscription.dispose()
        diffSubscription.dispose()
        diffEditor.dispose()
        originalModel.dispose()
        modifiedModel.dispose()
        editorRef.current = null
        originalModelRef.current = null
        modifiedModelRef.current = null
      }
    }, [])

    useEffect(() => {
      const model = originalModelRef.current
      if (!model) return
      if (original !== lastOriginalRef.current) {
        lastOriginalRef.current = original
        model.setValue(original)
      }
    }, [original])

    useEffect(() => {
      const model = modifiedModelRef.current
      if (!model) return
      if (modified !== lastModifiedRef.current) {
        lastModifiedRef.current = modified
        model.setValue(modified)
      }
    }, [modified])

    useEffect(() => {
      const monacoLanguage = MONACO_LANGUAGE[language]
      if (originalModelRef.current) {
        monaco.editor.setModelLanguage(originalModelRef.current, monacoLanguage)
      }
      if (modifiedModelRef.current) {
        monaco.editor.setModelLanguage(modifiedModelRef.current, monacoLanguage)
      }
    }, [language])

    useEffect(() => {
      editorRef.current?.updateOptions({
        ignoreTrimWhitespace: ignoreWhitespace,
      })
    }, [ignoreWhitespace])

    useEffect(() => {
      monaco.editor.setTheme(
        theme === 'dark' ? 'difflab-dark' : 'difflab-light',
      )
    }, [theme])

    return <div ref={containerRef} className="diff-editor" />
  },
)
