import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Gender, Kpi, MetricMode, SortKey } from '../types'
import churchesData from '../data/churches.json'
import type { ChurchRaw } from '../types'

interface DashboardState {
  churches: ChurchRaw[]
  kpi: Kpi
  setKpi: (k: Kpi) => void
  gender: Gender
  setGender: (g: Gender) => void
  metricMode: MetricMode
  setMetricMode: (m: MetricMode) => void
  sortKey: SortKey
  setSortKey: (s: SortKey) => void
  regionFilter: string[]
  setRegionFilter: (r: string[]) => void
  sizeFilter: string[]
  setSizeFilter: (s: string[]) => void
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

const DashboardContext = createContext<DashboardState | null>(null)

export function DashboardProvider({ children }: { children: ReactNode }) {
  const churches = churchesData as ChurchRaw[]
  const [kpi, setKpi] = useState<Kpi>('BS開始')
  const [gender, setGender] = useState<Gender>('total')
  const [metricMode, setMetricMode] = useState<MetricMode>('ratio')
  const [sortKey, setSortKey] = useState<SortKey>('ratioDesc')
  const [regionFilter, setRegionFilter] = useState<string[]>([])
  const [sizeFilter, setSizeFilter] = useState<string[]>([])
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light'
    const saved = window.localStorage.getItem('theme')
    if (saved === 'dark' || saved === 'light') return saved
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
    window.localStorage.setItem('theme', theme)
  }, [theme])

  const value = useMemo(
    () => ({
      churches,
      kpi,
      setKpi,
      gender,
      setGender,
      metricMode,
      setMetricMode,
      sortKey,
      setSortKey,
      regionFilter,
      setRegionFilter,
      sizeFilter,
      setSizeFilter,
      theme,
      toggleTheme: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
    }),
    [churches, kpi, gender, metricMode, sortKey, regionFilter, sizeFilter, theme]
  )

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>
}

export function useDashboard() {
  const ctx = useContext(DashboardContext)
  if (!ctx) throw new Error('useDashboard must be used within DashboardProvider')
  return ctx
}
