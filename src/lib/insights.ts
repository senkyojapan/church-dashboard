import type { ChurchRaw, Kpi } from '../types'
import { averageRatio, getMetrics } from './calc'
import { KPI_LIST } from '../types'

export interface Insight {
  kpi: Kpi
  text: string
  tone: 'pos' | 'neg' | 'flat'
}

/**
 * 各KPIについて、全国平均前年比との差から簡単な分析コメントを生成する。
 * しきい値: ±15pt以上で「上回っています／下回っています」、
 * ±5pt未満は「ほぼ全国平均並みです」。
 */
export function buildInsights(church: ChurchRaw, allChurches: ChurchRaw[]): Insight[] {
  const insights: Insight[] = []

  for (const kpi of KPI_LIST) {
    const m = getMetrics(church, kpi, 'total')
    const nationalAvg = averageRatio(allChurches, kpi, 'total')
    if (m.ratio === null || nationalAvg === null) continue

    const gap = m.ratio - nationalAvg
    let text: string
    let tone: Insight['tone']

    if (Math.abs(gap) < 5) {
      text = `${kpi}は全国平均とほぼ同水準です（前年比${m.ratio.toFixed(1)}%）。`
      tone = 'flat'
    } else if (gap > 0) {
      text = `${kpi}は全国平均を${gap.toFixed(0)}ポイント上回っています（前年比${m.ratio.toFixed(1)}%）。`
      tone = kpi === 'BSストップ' ? 'neg' : 'pos'
    } else {
      text = `${kpi}は全国平均を${Math.abs(gap).toFixed(0)}ポイント下回っています（前年比${m.ratio.toFixed(1)}%）。`
      tone = kpi === 'BSストップ' ? 'pos' : 'neg'
    }
    insights.push({ kpi, text, tone })
  }

  // BSストップ率が相対的に高い場合の注意コメント
  const stopMetrics = getMetrics(church, 'BSストップ', 'total')
  const startMetrics = getMetrics(church, 'BS開始', 'total')
  if (startMetrics.y2026 > 0) {
    const stopRate = (stopMetrics.y2026 / startMetrics.y2026) * 100
    if (stopRate >= 50) {
      insights.push({
        kpi: 'BSストップ',
        text: `BS開始に対するBSストップの割合が${stopRate.toFixed(0)}%とやや高い傾向があります。`,
        tone: 'neg',
      })
    }
  }

  return insights
}
