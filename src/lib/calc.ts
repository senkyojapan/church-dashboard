import type { ChurchRaw, Gender, Kpi, Metrics } from '../types'

/** 前年比・前年差を算出する。2025年実績が0の場合、比率は算出不能として null を返す */
export function computeMetrics(y2025: number, y2026: number): Metrics {
  const diff = y2026 - y2025
  const ratio = y2025 === 0 ? null : (y2026 / y2025) * 100
  return { y2025, y2026, diff, ratio }
}

export function getMetrics(church: ChurchRaw, kpi: Kpi, gender: Gender): Metrics {
  const v = church.kpi[kpi][gender]
  return computeMetrics(v.y2025, v.y2026)
}

/** 複数教会の指定 KPI・性別の値から単純平均の前年比・前年差を出す（表示用の参考統計） */
export function averageMetrics(churches: ChurchRaw[], kpi: Kpi, gender: Gender): Metrics {
  const sums = churches.reduce(
    (acc, c) => {
      const v = c.kpi[kpi][gender]
      acc.y2025 += v.y2025
      acc.y2026 += v.y2026
      return acc
    },
    { y2025: 0, y2026: 0 }
  )
  return computeMetrics(sums.y2025, sums.y2026)
}

/** 教会ごとの前年比の単純平均（%）。前年比算出不能な教会は除外 */
export function averageRatio(churches: ChurchRaw[], kpi: Kpi, gender: Gender): number | null {
  const ratios = churches
    .map((c) => getMetrics(c, kpi, gender).ratio)
    .filter((r): r is number => r !== null)
  if (ratios.length === 0) return null
  return ratios.reduce((a, b) => a + b, 0) / ratios.length
}

export function averageDiff(churches: ChurchRaw[], kpi: Kpi, gender: Gender): number {
  const diffs = churches.map((c) => getMetrics(c, kpi, gender).diff)
  return diffs.reduce((a, b) => a + b, 0) / (diffs.length || 1)
}

export function formatRatio(ratio: number | null): string {
  if (ratio === null) return '—'
  return `${ratio.toFixed(1)}%`
}

export function formatDiff(diff: number): string {
  if (diff > 0) return `+${diff}`
  return `${diff}`
}

export function uniqueRegions(churches: ChurchRaw[]): string[] {
  return Array.from(new Set(churches.map((c) => c.region))).sort()
}

export function uniqueSizes(churches: ChurchRaw[]): string[] {
  const order = ['大規模', '中規模', '小規模']
  const found = Array.from(new Set(churches.map((c) => c.size)))
  return found.sort((a, b) => order.indexOf(a) - order.indexOf(b))
}
