import { Download, Upload } from 'lucide-react'
import { useI18n } from '../i18n/I18nContext'
import type { Side } from '../types'

interface PanelHeaderProps {
  side: Side
  fileName: string | null
  hasContent: boolean
  onLoad: () => void
  onDownload: () => void
}

export function PanelHeader({
  side,
  fileName,
  hasContent,
  onLoad,
  onDownload,
}: PanelHeaderProps) {
  const { t } = useI18n()
  const sideLabel = t(side === 'original' ? 'panel.original' : 'panel.modified')

  return (
    <div className={`panel-header panel-header-${side}`}>
      <div className="panel-title">
        <span className={`side-dot side-dot-${side}`} aria-hidden="true" />
        <span>{sideLabel}</span>
        {fileName && (
          <span className="file-chip" title={fileName}>
            {fileName}
          </span>
        )}
      </div>

      <div className="panel-actions">
        <button
          type="button"
          className="icon-button is-small"
          onClick={onLoad}
          aria-label={`${t('panel.load')}: ${sideLabel}`}
          title={t('panel.loadHint')}
        >
          <Upload size={15} />
        </button>
        <button
          type="button"
          className="icon-button is-small"
          onClick={onDownload}
          disabled={!hasContent}
          aria-label={`${t('panel.download')}: ${sideLabel}`}
          title={t('panel.downloadHint')}
        >
          <Download size={15} />
        </button>
      </div>
    </div>
  )
}
