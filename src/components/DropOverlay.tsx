import type { DragEvent } from 'react'
import { UploadCloud } from 'lucide-react'
import { useI18n } from '../i18n/I18nContext'
import type { Side } from '../types'

interface DropOverlayProps {
  activeSide: Side | null
  onSideHover: (side: Side) => void
  onDropFile: (side: Side, event: DragEvent<HTMLDivElement>) => void
}

export function DropOverlay({
  activeSide,
  onSideHover,
  onDropFile,
}: DropOverlayProps) {
  const { t } = useI18n()

  return (
    <div className="drop-overlay">
      <div
        className={`drop-zone ${activeSide === 'original' ? 'is-active' : ''}`}
        onDragEnter={() => onSideHover('original')}
        onDragOver={(event) => {
          event.preventDefault()
          onSideHover('original')
        }}
        onDrop={(event) => onDropFile('original', event)}
      >
        <UploadCloud size={30} aria-hidden="true" />
        <p>{t('drop.original')}</p>
        <span className="drop-hint">{t('drop.hint')}</span>
      </div>

      <div
        className={`drop-zone ${activeSide === 'modified' ? 'is-active' : ''}`}
        onDragEnter={() => onSideHover('modified')}
        onDragOver={(event) => {
          event.preventDefault()
          onSideHover('modified')
        }}
        onDrop={(event) => onDropFile('modified', event)}
      >
        <UploadCloud size={30} aria-hidden="true" />
        <p>{t('drop.modified')}</p>
        <span className="drop-hint">{t('drop.hint')}</span>
      </div>
    </div>
  )
}
