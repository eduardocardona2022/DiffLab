import {
  CircleCheck,
  Info,
  TriangleExclamationPoint,
  X,
} from 'lucide-react'
import { useI18n } from '../i18n/I18nContext'
import type { ToastMessage } from '../types'

interface ToastViewportProps {
  toasts: ToastMessage[]
  onDismiss: (id: number) => void
}

export function ToastViewport({ toasts, onDismiss }: ToastViewportProps) {
  const { t } = useI18n()

  if (toasts.length === 0) return null

  return (
    <div className="toast-viewport" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          <span className="toast-icon" aria-hidden="true">
            {toast.type === 'success' && <CircleCheck size={17} />}
            {toast.type === 'error' && <TriangleExclamationPoint size={17} />}
            {toast.type === 'info' && <Info size={17} />}
          </span>
          <span className="toast-message">{toast.message}</span>
          <button
            type="button"
            className="toast-close"
            onClick={() => onDismiss(toast.id)}
            aria-label={t('toast.dismiss')}
            title={t('toast.dismiss')}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  )
}
