import { useState, useEffect, type ReactNode } from 'react'

// ------------------------------------------------------------------
// 簡易パスワードゲート
//
// 注意: これは静的サイト（サーバーなし）向けの「軽い目隠し」です。
// パスワードの照合はブラウザ側の JavaScript で行われるため、
// ブラウザの開発者ツール等でこのファイルの中身を見れば
// 正解のハッシュ値自体は分かってしまいます。
// 本格的なアクセス制限が必要な場合は、Cloudflare Access など
// 認証サービスの併用を検討してください。
// ------------------------------------------------------------------

// パスワードの平文はソースに残さず、SHA-256ハッシュ値のみを保持する
// ハッシュ値の作り方は README_PASSWORD.md を参照
const PASSWORD_HASH_HEX = import.meta.env.VITE_PASSWORD_HASH || ''

const SESSION_KEY = 'church-dashboard-auth'

async function sha256Hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export default function PasswordGate({ children }: { children: ReactNode }) {
  const [authorized, setAuthorized] = useState<boolean | null>(null)
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)
  const [checking, setChecking] = useState(false)

  useEffect(() => {
    if (!PASSWORD_HASH_HEX) {
      // パスワード未設定の場合はゲートをかけない（開発時など）
      setAuthorized(true)
      return
    }
    setAuthorized(sessionStorage.getItem(SESSION_KEY) === '1')
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setChecking(true)
    setError(false)
    const hash = await sha256Hex(input)
    if (hash === PASSWORD_HASH_HEX) {
      sessionStorage.setItem(SESSION_KEY, '1')
      setAuthorized(true)
    } else {
      setError(true)
    }
    setChecking(false)
  }

  if (authorized === null) {
    // 初回チェック中は何も表示しない（ちらつき防止）
    return null
  }

  if (authorized) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas dark:bg-canvas-dark px-4">
      <form
        onSubmit={handleSubmit}
        className="card w-full max-w-sm p-8 flex flex-col gap-4"
      >
        <div>
          <h1 className="text-lg font-semibold text-ink dark:text-ink-dark">
            宣教実績ダッシュボード
          </h1>
          <p className="text-sm text-ink/60 dark:text-ink-dark/60 mt-1">
            閲覧にはパスワードが必要です
          </p>
        </div>
        <input
          type="password"
          autoFocus
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
            setError(false)
          }}
          placeholder="パスワード"
          className="border border-border dark:border-border-dark rounded-lg px-3 py-2 bg-surface dark:bg-surface-dark text-ink dark:text-ink-dark text-sm focus:outline-none focus-visible:outline-2"
        />
        {error && (
          <p className="text-sm text-red-500">パスワードが違います</p>
        )}
        <button
          type="submit"
          disabled={checking || input.length === 0}
          className="bg-accent text-white rounded-lg px-3 py-2 text-sm font-medium disabled:opacity-50"
        >
          {checking ? '確認中…' : '入室する'}
        </button>
      </form>
    </div>
  )
}
