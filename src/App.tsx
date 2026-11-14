import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent as ReactDragEvent,
} from 'react'
import { DiffViewer, type DiffViewerHandle } from './components/DiffViewer'
import { DropOverlay } from './components/DropOverlay'
import { EmptyState } from './components/EmptyState'
import { Header } from './components/Header'
import { PanelHeader } from './components/PanelHeader'
import { StatusBar } from './components/StatusBar'
import { ToastViewport } from './components/ToastViewport'
import { Toolbar } from './components/Toolbar'
import { I18nProvider } from './i18n/I18nContext'
import { translate, type MessageKey, type MessageVars } from './i18n/translate'
import { buildDownloadFileName, downloadText } from './lib/download'
import { readTextFile } from './lib/files'
import { getTextMetrics } from './lib/format'
import { languageFromFileName } from './lib/languages'
import {
  loadPersistedState,
  savePersistedState,
  type PersistedState,
} from './lib/storage'
import type {
  DiffStats,
  LanguageId,
  Locale,
  Side,
  Theme,
  ToastMessage,
} from './types'

const EMPTY_STATS: DiffStats = { changes: 0, added: 0, removed: 0 }

export default function App() {
  const [initialState] = useState(loadPersistedState)

  const [leftText, setLeftText] = useState(initialState?.left ?? '')
  const [rightText, setRightText] = useState(initialState?.right ?? '')
  const [leftFileName, setLeftFileName] = useState<string | null>(
    initialState?.leftFileName ?? null,
  )
  const [rightFileName, setRightFileName] = useState<string | null>(
    initialState?.rightFileName ?? null,
  )
  const [language, setLanguage] = useState<LanguageId>(
    initialState?.language ?? 'text',
  )
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(
    initialState?.ignoreWhitespace ?? false,
  )
  const [locale, setLocale] = useState<Locale>(() => {
    if (initialState) return initialState.locale
    return navigator.language.toLowerCase().startsWith('es') ? 'es' : 'en'
  })
  const [theme, setTheme] = useState<Theme>(() => {
    if (initialState) return initialState.theme
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  })

  const [stats, setStats] = useState<DiffStats>(EMPTY_STATS)
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [dragSide, setDragSide] = useState<Side | null>(null)

  const diffRef = useRef<DiffViewerHandle>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const pendingSideRef = useRef<Side>('original')
  const toastIdRef = useRef(0)
  const persistenceWarnedRef = useRef(false)

  const t = useCallback(
    (key: MessageKey, vars?: MessageVars) => translate(locale, key, vars),
    [locale],
  )

  const dismissToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const pushToast = useCallback(
    (type: ToastMessage['type'], message: string) => {
      const id = ++toastIdRef.current
      setToasts((current) => [...current.slice(-3), { id, type, message }])
      window.setTimeout(() => {
        setToasts((current) => current.filter((toast) => toast.id !== id))
      }, 4500)
    },
    [],
  )

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = theme
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'dark' ? '#070b14' : '#f3f5fb')
  }, [theme])

  useEffect(() => {
    document.documentElement.lang = locale
    document.title = translate(locale, 'app.title')
  }, [locale])

  const persistedState = useMemo<PersistedState>(
    () => ({
      version: 1,
      left: leftText,
      right: rightText,
      leftFileName,
      rightFileName,
      language,
      ignoreWhitespace,
      locale,
      theme,
    }),
    [
      leftText,
      rightText,
      leftFileName,
      rightFileName,
      language,
      ignoreWhitespace,
      locale,
      theme,
    ],
  )

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const result = savePersistedState(persistedState)
      if (result !== 'saved' && !persistenceWarnedRef.current) {
        persistenceWarnedRef.current = true
        pushToast(
          'error',
          translate(
            locale,
            result === 'too-large'
              ? 'toast.persistTooLarge'
              : 'toast.persistError',
          ),
        )
      }
    }, 600)

    return () => window.clearTimeout(timeout)
  }, [persistedState, pushToast, locale])

  const loadFile = useCallback(
    async (side: Side, file: File) => {
      const result = await readTextFile(file)

      if (!result.ok) {
        pushToast(
          'error',
          t(
            result.error === 'too-large'
              ? 'toast.tooLarge'
              : result.error === 'binary'
                ? 'toast.binary'
                : 'toast.readError',
          ),
        )
        return
      }

      if (side === 'original') {
        setLeftText(result.text)
        setLeftFileName(result.name)
      } else {
        setRightText(result.text)
        setRightFileName(result.name)
      }

      const detectedLanguage = languageFromFileName(result.name)
      if (detectedLanguage && language === 'text') {
        setLanguage(detectedLanguage)
      }

      pushToast('success', t('toast.loaded', { name: result.name }))
    },
    [language, pushToast, t],
  )

  const openFilePicker = useCallback((side: Side) => {
    pendingSideRef.current = side
    fileInputRef.current?.click()
  }, [])

  const handleFileInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      event.target.value = ''
      if (file) void loadFile(pendingSideRef.current, file)
    },
    [loadFile],
  )

  useEffect(() => {
    let dragDepth = 0

    const hasFiles = (event: DragEvent) =>
      Array.from(event.dataTransfer?.types ?? []).includes('Files')

    const reset = () => {
      dragDepth = 0
      setDragActive(false)
      setDragSide(null)
    }

    const handleDragEnter = (event: DragEvent) => {
      if (!hasFiles(event)) return
      event.preventDefault()
      dragDepth += 1
      setDragActive(true)
    }

    const handleDragOver = (event: DragEvent) => {
      if (!hasFiles(event)) return
      event.preventDefault()
      if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy'
    }

    const handleDragLeave = (event: DragEvent) => {
      if (!hasFiles(event)) return
      dragDepth = Math.max(0, dragDepth - 1)
      if (dragDepth === 0) {
        setDragActive(false)
        setDragSide(null)
      }
    }

    const handleDrop = (event: DragEvent) => {
      if (!hasFiles(event)) return
      event.preventDefault()
      reset()
    }

    window.addEventListener('dragenter', handleDragEnter)
    window.addEventListener('dragover', handleDragOver)
    window.addEventListener('dragleave', handleDragLeave)
    window.addEventListener('drop', handleDrop)
    window.addEventListener('blur', reset)

    return () => {
      window.removeEventListener('dragenter', handleDragEnter)
      window.removeEventListener('dragover', handleDragOver)
      window.removeEventListener('dragleave', handleDragLeave)
      window.removeEventListener('drop', handleDrop)
      window.removeEventListener('blur', reset)
    }
  }, [])

  const handleDropFile = useCallback(
    (side: Side, event: ReactDragEvent<HTMLDivElement>) => {
      event.preventDefault()
      event.stopPropagation()
      const file = event.dataTransfer.files?.[0]
      setDragActive(false)
      setDragSide(null)
      if (file) void loadFile(side, file)
    },
    [loadFile],
  )

  const handleSwap = useCallback(() => {
    setLeftText(rightText)
    setRightText(leftText)
    setLeftFileName(rightFileName)
    setRightFileName(leftFileName)
  }, [leftText, rightText, leftFileName, rightFileName])

  const handleDownload = useCallback(
    (side: Side) => {
      const text = side === 'original' ? leftText : rightText
      if (!text) return

      const fileName = buildDownloadFileName(
        side,
        side === 'original' ? leftFileName : rightFileName,
        language,
      )
      downloadText(text, fileName)
    },
    [leftText, rightText, leftFileName, rightFileName, language],
  )

  const deferredLeftText = useDeferredValue(leftText)
  const deferredRightText = useDeferredValue(rightText)
  const leftMetrics = useMemo(
    () => getTextMetrics(deferredLeftText),
    [deferredLeftText],
  )
  const rightMetrics = useMemo(
    () => getTextMetrics(deferredRightText),
    [deferredRightText],
  )

  const isEmpty = leftText.length === 0 && rightText.length === 0

  return (
    <I18nProvider locale={locale}>
      <div className="app">
        <Header
          locale={locale}
          theme={theme}
          onLocaleChange={setLocale}
          onThemeChange={setTheme}
        />

        <main className="workspace">
          <section className="diff-card">
            <Toolbar
              language={language}
              ignoreWhitespace={ignoreWhitespace}
              stats={stats}
              onLanguageChange={setLanguage}
              onIgnoreWhitespaceChange={setIgnoreWhitespace}
              onSwap={handleSwap}
              onPrevious={() => diffRef.current?.goToPrevious()}
              onNext={() => diffRef.current?.goToNext()}
            />

            <div className="panel-headers">
              <PanelHeader
                side="original"
                fileName={leftFileName}
                hasContent={leftText.length > 0}
                onLoad={() => openFilePicker('original')}
                onDownload={() => handleDownload('original')}
              />
              <PanelHeader
                side="modified"
                fileName={rightFileName}
                hasContent={rightText.length > 0}
                onLoad={() => openFilePicker('modified')}
                onDownload={() => handleDownload('modified')}
              />
            </div>

            <div className="diff-area">
              <DiffViewer
                ref={diffRef}
                original={leftText}
                modified={rightText}
                language={language}
                ignoreWhitespace={ignoreWhitespace}
                theme={theme}
                onChangeOriginal={setLeftText}
                onChangeModified={setRightText}
                onStatsChange={setStats}
              />

              {isEmpty && (
                <EmptyState
                  onLoadOriginal={() => openFilePicker('original')}
                  onLoadModified={() => openFilePicker('modified')}
                />
              )}

              {dragActive && (
                <DropOverlay
                  activeSide={dragSide}
                  onSideHover={setDragSide}
                  onDropFile={handleDropFile}
                />
              )}
            </div>
          </section>
        </main>

        <StatusBar
          original={leftMetrics}
          modified={rightMetrics}
          language={language}
        />

        <ToastViewport toasts={toasts} onDismiss={dismissToast} />

        <input
          ref={fileInputRef}
          type="file"
          hidden
          onChange={handleFileInputChange}
        />
      </div>
    </I18nProvider>
  )
}
