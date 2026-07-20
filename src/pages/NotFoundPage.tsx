import { Link } from 'react-router-dom'
import Header from '../components/Header'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-[600px] px-6 py-24 text-center">
        <p className="text-5xl mb-4">🔍</p>
        <h1 className="text-lg font-semibold mb-2">ページが見つかりません</h1>
        <p className="text-sm text-ink-dim dark:text-ink-dimDark mb-6">
          指定されたページは存在しないか、移動した可能性があります。
        </p>
        <Link to="/" className="text-accent text-sm font-medium hover:underline">
          ダッシュボードに戻る
        </Link>
      </main>
    </div>
  )
}
