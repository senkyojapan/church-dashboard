import RankingChart from './RankingChart'
import GroupAverageChart from './GroupAverageChart'
import KpiCompareChart from './KpiCompareChart'

export default function ChartsSection() {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-sm font-semibold">グラフ分析</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <RankingChart field="ratio" title="① 前年比ランキング" unit="%" />
        <RankingChart field="value" title="② 2026年人数ランキング" unit="人" />
        <RankingChart field="diff" title="③ 前年差ランキング" unit="人" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GroupAverageChart groupBy="region" metric="ratio" title="④ 地域別 平均前年比" />
        <GroupAverageChart groupBy="region" metric="diff" title="⑤ 地域別 平均前年差" />
        <GroupAverageChart groupBy="size" metric="ratio" title="⑥ 教会規模別 平均前年比" />
        <GroupAverageChart groupBy="size" metric="diff" title="⑦ 教会規模別 平均前年差" />
      </div>
      <div className="grid grid-cols-1">
        <KpiCompareChart />
      </div>
    </section>
  )
}
