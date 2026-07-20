import { useMemo } from 'react'
import { useDashboard } from '../context/DashboardContext'
import { getMetrics } from '../lib/calc'
import ScoreCard from './ScoreCard'

export default function Highlights() {
  const { churches, kpi, gender, metricMode } = useDashboard()

  const { top5, bottom5, valueRange } = useMemo(() => {
    const withRatio = churches
      .map((c) => ({ church: c, metrics: getMetrics(c, kpi, gender) }))
      .filter((x) => x.metrics.ratio !== null)
      .sort((a, b) => (b.metrics.ratio as number) - (a.metrics.ratio as number))

    const values = churches.map((c) => getMetrics(c, kpi, gender).y2026)
    return {
      top5: withRatio.slice(0, 5).map((x) => x.church),
      bottom5: withRatio.slice(-5).reverse().map((x) => x.church),
      valueRange: { min: Math.min(...values), max: Math.max(...values) },
    }
  }, [churches, kpi, gender])

  if (top5.length === 0) return null

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <section>
        <h2 className="text-sm font-semibold mb-2.5 flex items-center gap-1.5">
          <span>🏆</span> 前年比 上位5教会
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {top5.map((c) => (
            <ScoreCard key={c.id} church={c} kpi={kpi} gender={gender} metricMode={metricMode} valueRange={valueRange} />
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-sm font-semibold mb-2.5 flex items-center gap-1.5">
          <span>⚠️</span> 前年比 下位5教会
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {bottom5.map((c) => (
            <ScoreCard key={c.id} church={c} kpi={kpi} gender={gender} metricMode={metricMode} valueRange={valueRange} />
          ))}
        </div>
      </section>
    </div>
  )
}
