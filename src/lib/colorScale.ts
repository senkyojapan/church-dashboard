import type { MetricMode } from '../types'

export interface ColorToken {
  bg: string // light mode background utility class
  bgDark: string // dark mode background utility class
  text: string
  textDark: string
  label: string
}

/**
 * 前年比（%）を5段階に分類して色を返す。
 * 120%以上: 濃い緑 / 100-119%: 薄い緑 / 100%: グレー / 80-99%: 薄い赤 / 80%未満: 濃い赤
 */
export function ratioColor(ratio: number | null): ColorToken {
  if (ratio === null) {
    return { bg: 'bg-flat-soft', bgDark: 'dark:bg-flat-softDark', text: 'text-flat-strong', textDark: 'dark:text-flat-strong', label: '算出不可' }
  }
  if (ratio >= 120) {
    return { bg: 'bg-pos-strong/90', bgDark: 'dark:bg-pos-strong/80', text: 'text-white', textDark: 'dark:text-white', label: '大幅増' }
  }
  if (ratio >= 100) {
    return { bg: 'bg-pos-soft', bgDark: 'dark:bg-pos-softDark', text: 'text-pos-strong', textDark: 'dark:text-pos-strong', label: '増加' }
  }
  if (ratio === 100) {
    return { bg: 'bg-flat-soft', bgDark: 'dark:bg-flat-softDark', text: 'text-flat-strong', textDark: 'dark:text-flat-strong', label: '横ばい' }
  }
  if (ratio >= 80) {
    return { bg: 'bg-neg-soft', bgDark: 'dark:bg-neg-softDark', text: 'text-neg-strong', textDark: 'dark:text-neg-strong', label: '減少' }
  }
  return { bg: 'bg-neg-strong/90', bgDark: 'dark:bg-neg-strong/80', text: 'text-white', textDark: 'dark:text-white', label: '大幅減' }
}

/** 前年差: プラス=緑 / ゼロ=グレー / マイナス=赤 */
export function diffColor(diff: number): ColorToken {
  if (diff > 0) {
    return { bg: 'bg-pos-soft', bgDark: 'dark:bg-pos-softDark', text: 'text-pos-strong', textDark: 'dark:text-pos-strong', label: '増加' }
  }
  if (diff < 0) {
    return { bg: 'bg-neg-soft', bgDark: 'dark:bg-neg-softDark', text: 'text-neg-strong', textDark: 'dark:text-neg-strong', label: '減少' }
  }
  return { bg: 'bg-flat-soft', bgDark: 'dark:bg-flat-softDark', text: 'text-flat-strong', textDark: 'dark:text-flat-strong', label: '横ばい' }
}

/** 2026年実績: 人数に応じたグラデーション（min-max を渡して正規化） */
export function valueColor(value: number, min: number, max: number): ColorToken {
  const range = max - min || 1
  const t = Math.max(0, Math.min(1, (value - min) / range))
  // accent の濃淡5段階
  if (t >= 0.8) return { bg: 'bg-accent', bgDark: 'dark:bg-accent', text: 'text-white', textDark: 'dark:text-white', label: '最多水準' }
  if (t >= 0.55) return { bg: 'bg-accent/70', bgDark: 'dark:bg-accent/70', text: 'text-white', textDark: 'dark:text-white', label: '高水準' }
  if (t >= 0.3) return { bg: 'bg-accent/35', bgDark: 'dark:bg-accent/40', text: 'text-ink dark:text-ink-dark', textDark: '', label: '中水準' }
  if (t >= 0.1) return { bg: 'bg-accent-soft', bgDark: 'dark:bg-accent-softDark', text: 'text-ink dark:text-ink-dark', textDark: '', label: '低水準' }
  return { bg: 'bg-flat-soft', bgDark: 'dark:bg-flat-softDark', text: 'text-flat-strong', textDark: 'dark:text-flat-strong', label: '僅少' }
}

export function metricColor(
  mode: MetricMode,
  metrics: { y2026: number; diff: number; ratio: number | null },
  valueRange: { min: number; max: number }
): ColorToken {
  if (mode === 'ratio') return ratioColor(metrics.ratio)
  if (mode === 'diff') return diffColor(metrics.diff)
  return valueColor(metrics.y2026, valueRange.min, valueRange.max)
}
