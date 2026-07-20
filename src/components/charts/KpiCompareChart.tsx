import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useDashboard } from '../../context/DashboardContext'
import { averageMetrics } from '../../lib/calc'
import { KPI_LIST } from '../../types'

export default function KpiCompareChart() {
  const { churches, gender } = useDashboard()

  const data = KPI_LIST.map((k) => {
    const m = averageMetrics(churches, k, gender)
    return { name: k, '2025年': m.y2025, '2026年': m.y2026 }
  })

  return (
    <div className="card p-4 flex flex-col gap-3">
      <p className="text-[13px] font-semibold">KPI別比較（全国合計・2025年 vs 2026年）</p>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ left: 0, right: 12, top: 8, bottom: 4 }}>
          <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#8A8A90" />
          <YAxis tick={{ fontSize: 10 }} stroke="#8A8A90" />
          <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="2025年" fill="#C7C9F5" radius={[4, 4, 0, 0]} />
          <Bar dataKey="2026年" fill="#4F5DED" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
