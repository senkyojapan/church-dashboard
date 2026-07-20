import { useDashboard } from '../context/DashboardContext'
import { GENDER_LIST, KPI_LIST } from '../types'
import type { MetricMode } from '../types'
import SegmentedControl from './SegmentedControl'

const METRIC_OPTIONS: { key: MetricMode; label: string }[] = [
  { key: 'value', label: '2026年実績' },
  { key: 'diff', label: '前年差' },
  { key: 'ratio', label: '前年比' },
]

export default function ControlBar() {
  const { kpi, setKpi, gender, setGender, metricMode, setMetricMode } = useDashboard()

  return (
    <div className="card p-4 sm:p-5 flex flex-col gap-4">
      <div>
        <p className="text-[11px] font-semibold text-ink-dim dark:text-ink-dimDark uppercase tracking-wide mb-2">
          KPI
        </p>
        <div className="flex flex-wrap gap-1.5">
          {KPI_LIST.map((k) => (
            <button
              key={k}
              onClick={() => setKpi(k)}
              className={[
                'px-3.5 py-1.5 rounded-lg text-[13px] font-medium border transition-colors',
                kpi === k
                  ? 'bg-accent text-white border-accent'
                  : 'bg-surface dark:bg-surface-dark border-border dark:border-border-dark text-ink-dim dark:text-ink-dimDark hover:border-accent/50 hover:text-ink dark:hover:text-ink-dark',
              ].join(' ')}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold text-ink-dim dark:text-ink-dimDark uppercase tracking-wide mb-2">
            表示単位
          </p>
          <SegmentedControl
            options={GENDER_LIST.map((g) => ({ key: g.key, label: g.label }))}
            value={gender}
            onChange={setGender}
            size="sm"
          />
        </div>
        <div>
          <p className="text-[11px] font-semibold text-ink-dim dark:text-ink-dimDark uppercase tracking-wide mb-2">
            指標
          </p>
          <SegmentedControl options={METRIC_OPTIONS} value={metricMode} onChange={setMetricMode} size="sm" />
        </div>
      </div>
    </div>
  )
}
