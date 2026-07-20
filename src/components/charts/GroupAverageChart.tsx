import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts'
import { useDashboard } from '../../context/DashboardContext'
import { averageDiff, averageRatio, uniqueRegions, uniqueSizes } from '../../lib/calc'

const COLORS = { pos: '#0F9D58', neg: '#D93636', flat: '#8A8A90' }

export default function GroupAverageChart({
  groupBy,
  metric,
  title,
}: {
  groupBy: 'region' | 'size'
  metric: 'ratio' | 'diff'
  title: string
}) {
  const { churches, kpi, gender } = useDashboard()

  const groups = groupBy === 'region' ? uniqueRegions(churches) : uniqueSizes(churches)

  const data = groups.map((g) => {
    const subset = churches.filter((c) => (groupBy === 'region' ? c.region === g : c.size === g))
    const value = metric === 'ratio' ? averageRatio(subset, kpi, gender) : averageDiff(subset, kpi, gender)
    return { name: g, value: value ?? 0 }
  })

  const barColor = (v: number) => {
    if (metric === 'ratio') return v >= 100 ? COLORS.pos : v === 100 ? COLORS.flat : COLORS.neg
    return v > 0 ? COLORS.pos : v < 0 ? COLORS.neg : COLORS.flat
  }

  return (
    <div className="card p-4 flex flex-col gap-3">
      <p className="text-[13px] font-semibold">{title}</p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ left: 0, right: 12, top: 8, bottom: 4 }}>
          <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#8A8A90" />
          <YAxis tick={{ fontSize: 10 }} stroke="#8A8A90" />
          {metric === 'ratio' && <ReferenceLine y={100} stroke="#8A8A90" strokeDasharray="3 3" />}
          {metric === 'diff' && <ReferenceLine y={0} stroke="#8A8A90" strokeDasharray="3 3" />}
          <Tooltip
            formatter={(v: number) => [metric === 'ratio' ? `${v.toFixed(1)}%` : `${v.toFixed(1)}人`, title]}
            contentStyle={{ fontSize: 12, borderRadius: 8 }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((d, i) => (
              <Cell key={i} fill={barColor(d.value)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
