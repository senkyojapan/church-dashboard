import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts'
import { useDashboard } from '../../context/DashboardContext'
import { getMetrics } from '../../lib/calc'

type Field = 'ratio' | 'diff' | 'value'

const COLORS = {
  pos: '#0F9D58',
  neg: '#D93636',
  flat: '#8A8A90',
  accent: '#4F5DED',
}

export default function RankingChart({ field, title, unit }: { field: Field; title: string; unit: string }) {
  const { churches, kpi, gender } = useDashboard()

  const data = churches
    .map((c) => {
      const m = getMetrics(c, kpi, gender)
      const raw = field === 'ratio' ? m.ratio : field === 'diff' ? m.diff : m.y2026
      return { name: c.name, value: raw }
    })
    .filter((d) => d.value !== null) as { name: string; value: number }[]

  data.sort((a, b) => b.value - a.value)

  const barColor = (v: number) => {
    if (field === 'value') return COLORS.accent
    if (field === 'ratio') return v >= 100 ? COLORS.pos : v === 100 ? COLORS.flat : COLORS.neg
    return v > 0 ? COLORS.pos : v < 0 ? COLORS.neg : COLORS.flat
  }

  return (
    <div className="card p-4 flex flex-col gap-3">
      <p className="text-[13px] font-semibold">{title}</p>
      <div style={{ height: Math.max(280, data.length * 20) }} className="max-h-[520px] overflow-y-auto scrollbar-thin">
        <ResponsiveContainer width="100%" height={Math.max(280, data.length * 20)}>
          <BarChart data={data} layout="vertical" margin={{ left: 8, right: 24, top: 4, bottom: 4 }}>
            <XAxis type="number" tick={{ fontSize: 10 }} stroke="#8A8A90" />
            <YAxis
              type="category"
              dataKey="name"
              width={110}
              tick={{ fontSize: 10 }}
              stroke="#8A8A90"
              interval={0}
            />
            {field === 'ratio' && <ReferenceLine x={100} stroke="#8A8A90" strokeDasharray="3 3" />}
            {field === 'diff' && <ReferenceLine x={0} stroke="#8A8A90" strokeDasharray="3 3" />}
            <Tooltip
              formatter={(v: number) => [`${v.toFixed(field === 'ratio' ? 1 : 0)}${unit}`, title]}
              contentStyle={{ fontSize: 12, borderRadius: 8 }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {data.map((d, i) => (
                <Cell key={i} fill={barColor(d.value)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
