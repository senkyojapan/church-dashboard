export type Kpi = 'BS開始' | 'デビュー' | 'BSストップ' | 'BS中'
export type Gender = 'total' | '男' | '女'
export type MetricMode = 'value' | 'diff' | 'ratio'
export type SortKey =
  | 'ratioDesc'
  | 'ratioAsc'
  | 'diffDesc'
  | 'diffAsc'
  | 'valueDesc'
  | 'valueAsc'
  | 'nameAsc'

export const KPI_LIST: Kpi[] = ['BS開始', 'デビュー', 'BSストップ', 'BS中']
export const GENDER_LIST: { key: Gender; label: string }[] = [
  { key: 'total', label: '全体' },
  { key: '男', label: '男性' },
  { key: '女', label: '女性' },
]

export interface YearValue {
  y2025: number
  y2026: number
}

export interface ChurchRaw {
  id: string
  key: string
  name: string
  region: string
  size: string
  totalMembers: number | null
  kpi: Record<Kpi, Record<Gender, YearValue>>
}

/** 1教会・1KPI・1性別に対する計算済み指標 */
export interface Metrics {
  y2025: number
  y2026: number
  diff: number
  ratio: number | null // null = 前年が0で比率算出不能
}

export interface ChurchComputed extends ChurchRaw {
  metrics: Metrics // 現在選択中の KPI・性別に対応する値
}
