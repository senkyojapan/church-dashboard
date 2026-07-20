import { useMemo } from 'react'
import { useDashboard } from '../context/DashboardContext'
import { uniqueRegions, uniqueSizes } from '../lib/calc'
import type { SortKey } from '../types'

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'ratioDesc', label: '前年比が高い順' },
  { key: 'ratioAsc', label: '前年比が低い順' },
  { key: 'diffDesc', label: '前年差が大きい順' },
  { key: 'diffAsc', label: '前年差が小さい順' },
  { key: 'valueDesc', label: '2026年人数が多い順' },
  { key: 'valueAsc', label: '2026年人数が少ない順' },
  { key: 'nameAsc', label: '教会名順' },
]

function toggle(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
}

export default function FilterBar() {
  const { churches, regionFilter, setRegionFilter, sizeFilter, setSizeFilter, sortKey, setSortKey } =
    useDashboard()

  const regions = useMemo(() => uniqueRegions(churches), [churches])
  const sizes = useMemo(() => uniqueSizes(churches), [churches])

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-semibold text-ink-dim dark:text-ink-dimDark mr-1">地域</span>
          {regions.map((r) => (
            <button
              key={r}
              onClick={() => setRegionFilter(toggle(regionFilter, r))}
              className={[
                'px-2.5 py-1 rounded-md text-xs font-medium border transition-colors',
                regionFilter.includes(r)
                  ? 'bg-accent/10 border-accent text-accent'
                  : 'border-border dark:border-border-dark text-ink-dim dark:text-ink-dimDark hover:text-ink dark:hover:text-ink-dark',
              ].join(' ')}
            >
              {r}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-semibold text-ink-dim dark:text-ink-dimDark mr-1">規模</span>
          {sizes.map((s) => (
            <button
              key={s}
              onClick={() => setSizeFilter(toggle(sizeFilter, s))}
              className={[
                'px-2.5 py-1 rounded-md text-xs font-medium border transition-colors',
                sizeFilter.includes(s)
                  ? 'bg-accent/10 border-accent text-accent'
                  : 'border-border dark:border-border-dark text-ink-dim dark:text-ink-dimDark hover:text-ink dark:hover:text-ink-dark',
              ].join(' ')}
            >
              {s}
            </button>
          ))}
        </div>
        {(regionFilter.length > 0 || sizeFilter.length > 0) && (
          <button
            onClick={() => {
              setRegionFilter([])
              setSizeFilter([])
            }}
            className="text-xs text-accent hover:underline"
          >
            条件をクリア
          </button>
        )}
      </div>

      <select
        value={sortKey}
        onChange={(e) => setSortKey(e.target.value as SortKey)}
        className="text-[13px] rounded-lg border border-border dark:border-border-dark bg-surface dark:bg-surface-dark px-3 py-1.5 font-medium"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.key} value={o.key}>
            並び替え：{o.label}
          </option>
        ))}
      </select>
    </div>
  )
}
