import { Columns2, Moon, Sun } from 'lucide-react'
import { useI18n } from '../i18n/I18nContext'
import type { Locale, Theme } from '../types'

interface HeaderProps {
  locale: Locale
  theme: Theme
  onLocaleChange: (locale: Locale) => void
  onThemeChange: (theme: Theme) => void
}

export function Header({
  locale,
  theme,
  onLocaleChange,
  onThemeChange,
}: HeaderProps) {
  const { t } = useI18n()
  const themeLabel = t(
    theme === 'dark' ? 'header.theme.toLight' : 'header.theme.toDark',
  )

  return (
    <header className="app-header">
      <div className="brand">
        <div className="brand-mark" aria-hidden="true">
          <Columns2 size={20} strokeWidth={2.1} />
        </div>
        <div className="brand-text">
          <span className="brand-name">DiffLab</span>
          <span className="brand-tagline">{t('app.subtitle')}</span>
        </div>
      </div>

      <div className="header-actions">
        <div
          className="locale-switch"
          role="group"
          aria-label={t('header.language')}
        >
          <button
            type="button"
            className={locale === 'es' ? 'is-active' : undefined}
            aria-pressed={locale === 'es'}
            onClick={() => onLocaleChange('es')}
          >
            ES
          </button>
          <button
            type="button"
            className={locale === 'en' ? 'is-active' : undefined}
            aria-pressed={locale === 'en'}
            onClick={() => onLocaleChange('en')}
          >
            EN
          </button>
        </div>

        <button
          type="button"
          className="icon-button header-theme"
          onClick={() => onThemeChange(theme === 'dark' ? 'light' : 'dark')}
          aria-label={themeLabel}
          title={themeLabel}
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>
      </div>
    </header>
  )
}
