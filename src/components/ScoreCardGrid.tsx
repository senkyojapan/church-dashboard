import { useMemo } from 'react'
import { useDashboard } from '../context/DashboardContext'
import { getMetrics } from '../lib/calc'
import ScoreCard from './ScoreCard'
import FilterBar from './FilterBar'

export default function ScoreCardGrid() {
  const { churches, kpi, gender, metricMode, regionFilter, sizeFilter, sortKey } = useDashboard()

  const { filtered, valueRange } = useMemo(() => {
    let list = churches
    if (regionFilter.length > 0) list = list.filter((c) => regionFilter.includes(c.region))
    if (sizeFilter.length > 0) list = list.filter((c) => sizeFilter.includes(c.size))

    const withMetrics = list.map((c) => ({ church: c, m: getMetrics(c, kpi, gender) }))

    withMetrics.sort((a, b) => {
      switch (sortKey) {
        case 'ratioDesc':
          return (b.m.ratio ?? -Infinity) - (a.m.ratio ?? -Infinity)
        case 'ratioAsc':
          return (a.m.ratio ?? Infinity) - (b.m.ratio ?? Infinity)
        case 'diffDesc':
          return b.m.diff - a.m.diff
        case 'diffAsc':
          return a.m.diff - b.m.diff
        case 'valueDesc':
          return b.m.y2026 - a.m.y2026
        case 'valueAsc':
          return a.m.y2026 - b.m.y2026
        case 'nameAsc':
          return a.church.name.localeCompare(b.church.name, 'ja')
        default:
          return 0
      }
    })

    const values = churches.map((c) => getMetrics(c, kpi, gender).y2026)
    return {
      filtered: withMetrics.map((x) => x.church),
      valueRange: { min: Math.min(...values), max: Math.max(...values) },
    }
  }, [churches, kpi, gender, regionFilter, sizeFilter, sortKey])

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">教会一覧（{filtered.length}件）</h2>
      </div>
      <FilterBar />
      {filtered.length === 0 ? (
        <div className="card p-10 text-center text-ink-dim dark:text-ink-dimDark text-sm">
          条件に一致する教会がありません。フィルター条件を見直してください。
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filtered.map((c) => (
            <ScoreCard
              key={c.id}
              church={c}
              kpi={kpi}
              gender={gender}
              metricMode={metricMode}
              valueRange={valueRange}
            />
          ))}
        </div>
      )}
    </section>
  )
}
