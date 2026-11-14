import { FileDiff, Upload } from 'lucide-react'
import { useI18n } from '../i18n/I18nContext'

interface EmptyStateProps {
  onLoadOriginal: () => void
  onLoadModified: () => void
}

export function EmptyState({
  onLoadOriginal,
  onLoadModified,
}: EmptyStateProps) {
  const { t } = useI18n()

  return (
    <div className="empty-state">
      <div className="empty-card">
        <div className="empty-icon" aria-hidden="true">
          <FileDiff size={26} />
        </div>
        <h2>{t('empty.title')}</h2>
        <p>{t('empty.hint')}</p>
        <div className="empty-actions">
          <button type="button" className="button" onClick={onLoadOriginal}>
            <Upload size={15} aria-hidden="true" />
            {t('empty.loadOriginal')}
          </button>
          <button type="button" className="button" onClick={onLoadModified}>
            <Upload size={15} aria-hidden="true" />
            {t('empty.loadModified')}
          </button>
        </div>
      </div>
    </div>
  )
}
