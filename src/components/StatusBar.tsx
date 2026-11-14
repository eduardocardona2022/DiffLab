import { ShieldCheck } from 'lucide-react'
import { useI18n } from '../i18n/I18nContext'
import { formatBytes } from '../lib/format'
import { LANGUAGE_LABEL_KEY } from '../lib/languages'
import type { LanguageId, Side, TextMetrics } from '../types'

interface StatusBarProps {
  original: TextMetrics
  modified: TextMetrics
  language: LanguageId
}

function SideStatus({
  side,
  metrics,
}: {
  side: Side
  metrics: TextMetrics
}) {
  const { t, formatNumber, locale } = useI18n()

  return (
    <span className="status-side">
      <span className={`side-dot side-dot-${side}`} aria-hidden="true" />
      <strong>{t(side === 'original' ? 'panel.original' : 'panel.modified')}</strong>
      <span>{t('status.lines', { count: formatNumber(metrics.lines) })}</span>
      <span className="status-separator" aria-hidden="true">
        ·
      </span>
      <span className="status-optional">
        {t('status.characters', { count: formatNumber(metrics.characters) })}
      </span>
      <span className="status-separator status-optional" aria-hidden="true">
        ·
      </span>
      <span>{formatBytes(metrics.bytes, locale)}</span>
    </span>
  )
}

export function StatusBar({ original, modified, language }: StatusBarProps) {
  const { t } = useI18n()

  return (
    <footer className="status-bar">
      <SideStatus side="original" metrics={original} />
      <span className="status-divider" aria-hidden="true" />
      <SideStatus side="modified" metrics={modified} />
      <span className="status-language" title={t('toolbar.language')}>
        {t(LANGUAGE_LABEL_KEY[language])}
      </span>
      <div className="status-local">
        <ShieldCheck size={13} aria-hidden="true" />
        <span>{t('status.privacy')}</span>
      </div>
    </footer>
  )
}
