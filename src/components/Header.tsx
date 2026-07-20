import { Link } from 'react-router-dom'
import { useDashboard } from '../context/DashboardContext'

export default function Header() {
  const { theme, toggleTheme } = useDashboard()
  return (
    <header className="sticky top-0 z-30 border-b border-border dark:border-border-dark bg-canvas/80 dark:bg-canvas-dark/80 backdrop-blur">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <span className="grid place-items-center w-8 h-8 rounded-lg bg-accent text-white text-sm font-bold">宣</span>
          <div className="leading-tight">
            <p className="text-[15px] font-semibold tracking-tight">宣教実績ダッシュボード</p>
            <p className="text-[11px] text-ink-dim dark:text-ink-dimDark">全国教会 前年比ポータル・2026年版</p>
          </div>
        </Link>
        <button
          onClick={toggleTheme}
          aria-label="テーマ切替"
          className="w-9 h-9 grid place-items-center rounded-lg border border-border dark:border-border-dark hover:bg-surface dark:hover:bg-surface-dark transition-colors text-sm"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  )
}
