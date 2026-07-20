import { useMemo } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import Header from '../components/Header'
import { useDashboard } from '../context/DashboardContext'
import { KPI_LIST } from '../types'
import { averageRatio, formatDiff, formatRatio, getMetrics } from '../lib/calc'
import { ratioColor } from '../lib/colorScale'
import { buildInsights } from '../lib/insights'

export default function ChurchDetailPage() {
  const { id } = useParams()
  const { churches } = useDashboard()
  const church = churches.find((c) => c.id === id)

  const insights = useMemo(() => (church ? buildInsights(church, churches) : []), [church, churches])

  if (!church) return <Navigate to="/" replace />

  const sameRegion = churches.filter((c) => c.region === church.region)
  const sameSize = churches.filter((c) => c.size === church.size)

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-[1100px] px-4 sm:px-6 py-6 flex flex-col gap-6">
        <div>
          <Link to="/" className="text-[13px] text-accent hover:underline">
            ← ダッシュボードに戻る
          </Link>
        </div>

        {/* 基本情報 */}
        <section className="card p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold">{church.name}</h1>
              <p className="text-[13px] text-ink-dim dark:text-ink-dimDark mt-1">
                {church.region} ・ {church.size}
                {church.totalMembers ? ` ・ 総メンバー数 ${church.totalMembers}名` : ' ・ 総メンバー数 不明'}
              </p>
            </div>
          </div>
        </section>

        {/* KPI別: 2025→2026比較・前年差・前年比・男女比較 */}
        <section className="card p-5 sm:p-6 overflow-x-auto scrollbar-thin">
          <h2 className="text-sm font-semibold mb-4">KPI別 実績比較（2025年 → 2026年）</h2>
          <table className="w-full text-[13px] min-w-[640px]">
            <thead>
              <tr className="text-left text-ink-dim dark:text-ink-dimDark border-b border-border dark:border-border-dark">
                <th className="py-2 pr-3 font-medium">KPI</th>
                <th className="py-2 px-3 font-medium">性別</th>
                <th className="py-2 px-3 font-medium num text-right">2025年</th>
                <th className="py-2 px-3 font-medium num text-right">2026年</th>
                <th className="py-2 px-3 font-medium num text-right">前年差</th>
                <th className="py-2 pl-3 font-medium num text-right">前年比</th>
              </tr>
            </thead>
            <tbody>
              {KPI_LIST.map((kpi) =>
                (['total', '男', '女'] as const).map((g, gi) => {
                  const m = getMetrics(church, kpi, g)
                  const color = ratioColor(m.ratio)
                  return (
                    <tr key={`${kpi}-${g}`} className="border-b border-border/60 dark:border-border-dark/60 last:border-0">
                      {gi === 0 ? (
                        <td rowSpan={3} className="py-2 pr-3 font-semibold align-top">
                          {kpi}
                        </td>
                      ) : null}
                      <td className="py-2 px-3 text-ink-dim dark:text-ink-dimDark">
                        {g === 'total' ? '全体' : g === '男' ? '男性' : '女性'}
                      </td>
                      <td className="py-2 px-3 num text-right">{m.y2025}</td>
                      <td className="py-2 px-3 num text-right font-medium">{m.y2026}</td>
                      <td className="py-2 px-3 num text-right">{formatDiff(m.diff)}</td>
                      <td className="py-2 pl-3 text-right">
                        <span className={['inline-block px-1.5 py-0.5 rounded text-xs font-semibold', color.bg, color.bgDark, color.text].join(' ')}>
                          {formatRatio(m.ratio)}
                        </span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </section>

        {/* 平均比較 */}
        <section className="card p-5 sm:p-6">
          <h2 className="text-sm font-semibold mb-4">平均との比較（全体・KPIごとの前年比）</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={KPI_LIST.map((kpi) => ({
                name: kpi,
                当教会: getMetrics(church, kpi, 'total').ratio ?? 0,
                全国平均: averageRatio(churches, kpi, 'total') ?? 0,
                地域平均: averageRatio(sameRegion, kpi, 'total') ?? 0,
                規模平均: averageRatio(sameSize, kpi, 'total') ?? 0,
              }))}
              margin={{ left: 0, right: 12, top: 8, bottom: 4 }}
            >
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#8A8A90" />
              <YAxis tick={{ fontSize: 10 }} stroke="#8A8A90" unit="%" />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={(v: number) => `${v.toFixed(1)}%`} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="当教会" fill="#4F5DED" radius={[4, 4, 0, 0]} />
              <Bar dataKey="全国平均" fill="#C7C9F5" radius={[4, 4, 0, 0]} />
              <Bar dataKey="地域平均" fill="#B7E4C7" radius={[4, 4, 0, 0]} />
              <Bar dataKey="規模平均" fill="#F5D6B7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>

        {/* 差分サマリー表 */}
        <section className="card p-5 sm:p-6 overflow-x-auto scrollbar-thin">
          <h2 className="text-sm font-semibold mb-4">全国 / 地域 / 規模平均との前年比の差（ポイント）</h2>
          <table className="w-full text-[13px] min-w-[520px]">
            <thead>
              <tr className="text-left text-ink-dim dark:text-ink-dimDark border-b border-border dark:border-border-dark">
                <th className="py-2 pr-3 font-medium">KPI</th>
                <th className="py-2 px-3 font-medium num text-right">当教会 前年比</th>
                <th className="py-2 px-3 font-medium num text-right">全国平均との差</th>
                <th className="py-2 px-3 font-medium num text-right">地域平均との差</th>
                <th className="py-2 pl-3 font-medium num text-right">規模平均との差</th>
              </tr>
            </thead>
            <tbody>
              {KPI_LIST.map((kpi) => {
                const own = getMetrics(church, kpi, 'total').ratio
                const nat = averageRatio(churches, kpi, 'total')
                const reg = averageRatio(sameRegion, kpi, 'total')
                const size = averageRatio(sameSize, kpi, 'total')
                const gap = (a: number | null, b: number | null) => (a !== null && b !== null ? a - b : null)
                return (
                  <tr key={kpi} className="border-b border-border/60 dark:border-border-dark/60 last:border-0">
                    <td className="py-2 pr-3 font-semibold">{kpi}</td>
                    <td className="py-2 px-3 num text-right">{formatRatio(own)}</td>
                    <td className="py-2 px-3 num text-right">{fmtGap(gap(own, nat))}</td>
                    <td className="py-2 px-3 num text-right">{fmtGap(gap(own, reg))}</td>
                    <td className="py-2 pl-3 num text-right">{fmtGap(gap(own, size))}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </section>

        {/* 分析コメント */}
        <section className="card p-5 sm:p-6">
          <h2 className="text-sm font-semibold mb-4">分析コメント</h2>
          {insights.length === 0 ? (
            <p className="text-sm text-ink-dim dark:text-ink-dimDark">算出可能なデータがありません。</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {insights.map((ins, i) => (
                <li
                  key={i}
                  className={[
                    'text-[13px] px-3 py-2 rounded-lg border-l-4',
                    ins.tone === 'pos'
                      ? 'border-pos-strong bg-pos-soft dark:bg-pos-softDark text-pos-strong'
                      : ins.tone === 'neg'
                      ? 'border-neg-strong bg-neg-soft dark:bg-neg-softDark text-neg-strong'
                      : 'border-flat-strong bg-flat-soft dark:bg-flat-softDark text-flat-strong',
                  ].join(' ')}
                >
                  {ins.text}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  )
}

function fmtGap(v: number | null): string {
  if (v === null) return '—'
  const sign = v > 0 ? '+' : ''
  return `${sign}${v.toFixed(1)}pt`
}
