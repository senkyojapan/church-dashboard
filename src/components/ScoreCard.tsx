import { Link } from 'react-router-dom'
import type { ChurchRaw, Kpi, Gender, MetricMode } from '../types'
import { getMetrics, formatDiff, formatRatio } from '../lib/calc'
import { metricColor } from '../lib/colorScale'

export default function ScoreCard({
  church,
  kpi,
  gender,
  metricMode,
  valueRange,
}: {
  church: ChurchRaw
  kpi: Kpi
  gender: Gender
  metricMode: MetricMode
  valueRange: { min: number; max: number }
}) {
  const m = getMetrics(church, kpi, gender)
  const color = metricColor(metricMode, m, valueRange)

  return (
    <Link
      to={`/church/${church.id}`}
      className={[
        'group relative flex flex-col gap-3 rounded-xl border border-border dark:border-border-dark p-4 transition-transform hover:-translate-y-0.5 hover:shadow-card',
        color.bg,
        color.bgDark,
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className={['font-semibold text-[15px] leading-snug', color.text].join(' ')}>{church.name}</p>
          <p className={['text-[11px] mt-0.5 opacity-80', color.text].join(' ')}>
            {church.region} ・ {church.size}
            {church.totalMembers ? ` ・ 総${church.totalMembers}名` : ''}
          </p>
        </div>
        <span className={['text-[10px] font-medium px-1.5 py-0.5 rounded shrink-0 bg-black/5 dark:bg-white/10', color.text].join(' ')}>
          {kpi}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-1">
        <div>
          <p className={['text-[10px] opacity-70', color.text].join(' ')}>2026年</p>
          <p className={['num text-lg font-bold', color.text].join(' ')}>{m.y2026}</p>
        </div>
        <div>
          <p className={['text-[10px] opacity-70', color.text].join(' ')}>前年差</p>
          <p className={['num text-lg font-bold', color.text].join(' ')}>{formatDiff(m.diff)}</p>
        </div>
        <div>
          <p className={['text-[10px] opacity-70', color.text].join(' ')}>前年比</p>
          <p className={['num text-lg font-bold', color.text].join(' ')}>{formatRatio(m.ratio)}</p>
        </div>
      </div>
    </Link>
  )
}
