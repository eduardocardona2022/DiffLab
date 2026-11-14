import {
  ArrowLeftRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { useI18n } from '../i18n/I18nContext'
import {
  LANGUAGE_LABEL_KEY,
  LANGUAGE_OPTIONS,
} from '../lib/languages'
import type { DiffStats, LanguageId } from '../types'

interface ToolbarProps {
  language: LanguageId
  ignoreWhitespace: boolean
  stats: DiffStats
  onLanguageChange: (language: LanguageId) => void
  onIgnoreWhitespaceChange: (value: boolean) => void
  onSwap: () => void
  onPrevious: () => void
  onNext: () => void
}

export function Toolbar({
  language,
  ignoreWhitespace,
  stats,
  onLanguageChange,
  onIgnoreWhitespaceChange,
  onSwap,
  onPrevious,
  onNext,
}: ToolbarProps) {
  const { t, formatNumber } = useI18n()

  const changeLabel =
    stats.changes === 0
      ? t('stats.none')
      : stats.changes === 1
        ? t('stats.change')
        : t('stats.changes', { count: formatNumber(stats.changes) })

  return (
    <div className="toolbar">
      <div className="control">
        <span className="control-label">{t('toolbar.language')}</span>
        <div className="select-wrap">
          <select
            value={language}
            onChange={(event) =>
              onLanguageChange(event.target.value as LanguageId)
            }
            aria-label={t('toolbar.language')}
          >
            {LANGUAGE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {t(LANGUAGE_LABEL_KEY[option])}
              </option>
            ))}
          </select>
          <ChevronDown className="select-icon" size={14} aria-hidden="true" />
        </div>
      </div>

      <span className="toolbar-divider" aria-hidden="true" />

      <button
        type="button"
        role="switch"
        aria-checked={ignoreWhitespace}
        className={`toggle ${ignoreWhitespace ? 'is-on' : ''}`}
        onClick={() => onIgnoreWhitespaceChange(!ignoreWhitespace)}
        title={t('toolbar.ignore.hint')}
      >
        <span className="toggle-track" aria-hidden="true">
          <span className="toggle-thumb" />
        </span>
        <span className="toggle-text">{t('toolbar.ignore')}</span>
      </button>

      <div className="toolbar-spacer" />

      <div
        className={`stats ${stats.changes === 0 ? 'is-empty' : ''}`}
        aria-live="polite"
      >
        <span className="stat-count">{changeLabel}</span>
        {stats.changes > 0 && (
          <>
            <span className="stat stat-added" title={t('stats.addedTitle')}>
              +{formatNumber(stats.added)}
            </span>
            <span className="stat stat-removed" title={t('stats.removedTitle')}>
              −{formatNumber(stats.removed)}
            </span>
          </>
        )}
      </div>

      <div className="nav-group">
        <button
          type="button"
          className="icon-button is-compact"
          onClick={onPrevious}
          disabled={stats.changes === 0}
          aria-label={t('toolbar.previous')}
          title={t('toolbar.previous')}
        >
          <ChevronUp size={16} />
        </button>
        <button
          type="button"
          className="icon-button is-compact"
          onClick={onNext}
          disabled={stats.changes === 0}
          aria-label={t('toolbar.next')}
          title={t('toolbar.next')}
        >
          <ChevronDown size={16} />
        </button>
      </div>

      <button
        type="button"
        className="toolbar-button"
        onClick={onSwap}
        title={t('toolbar.swap')}
      >
        <ArrowLeftRight size={15} aria-hidden="true" />
        <span>{t('toolbar.swap')}</span>
      </button>
    </div>
  )
}
