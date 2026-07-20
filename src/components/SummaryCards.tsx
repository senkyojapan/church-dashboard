import { useMemo } from 'react'
import { useDashboard } from '../context/DashboardContext'
import { averageMetrics, averageRatio, formatDiff, formatRatio } from '../lib/calc'

export default function SummaryCards() {
  const { churches, kpi, gender } = useDashboard()

  const national = useMemo(() => averageMetrics(churches, kpi, gender), [churches, kpi, gender])
  const avgRatio = useMemo(() => averageRatio(churches, kpi, gender), [churches, kpi, gender])

  const cards = [
    { label: `全国合計（${kpi}・2026年）`, value: `${national.y2026}人` },
    { label: '全国前年比（合計ベース）', value: formatRatio(national.ratio) },
    { label: '全国前年差（合計）', value: `${formatDiff(national.diff)}人` },
    { label: '教会単位の平均前年比', value: formatRatio(avgRatio) },
    { label: '前年差合計（30教会）', value: `${formatDiff(national.diff)}人` },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {cards.map((c) => (
        <div key={c.label} className="card p-4">
          <p className="text-[11px] leading-snug text-ink-dim dark:text-ink-dimDark mb-1.5 min-h-[28px]">
            {c.label}
          </p>
          <p className="text-2xl font-semibold num tracking-tight">{c.value}</p>
        </div>
      ))}
    </div>
  )
}
