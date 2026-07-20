import Header from '../components/Header'
import SummaryCards from '../components/SummaryCards'
import ControlBar from '../components/ControlBar'
import Highlights from '../components/Highlights'
import ChartsSection from '../components/charts/ChartsSection'
import ScoreCardGrid from '../components/ScoreCardGrid'

export default function DashboardPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-[1400px] px-4 sm:px-6 py-6 flex flex-col gap-6">
        <SummaryCards />
        <ControlBar />
        <Highlights />
        <ChartsSection />
        <ScoreCardGrid />
        <footer className="text-center text-[11px] text-ink-dim dark:text-ink-dimDark py-6">
          関係者限定ポータル・検索エンジン非公開 ／ データ最終更新：教会実績シート反映済み
        </footer>
      </main>
    </div>
  )
}
