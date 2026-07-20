# 宣教実績ダッシュボード（Church Mission Dashboard）

全国約30教会の宣教実績（BS開始・デビュー・BSストップ・BS中）を、前年比・地域比較・教会規模比較を通じて分析できる静的Webダッシュボードです。React + TypeScript + Vite + TailwindCSS + Recharts で構築し、**サーバー・データベースを一切使わずGitHub Pagesのみで公開・運用**できます。

設計の詳細（画面設計・UIモックアップ・システム設計・データ設計）は [`DESIGN.md`](./DESIGN.md) を参照してください。

## 特長

- KPI（BS開始／デビュー／BSストップ／BS中）・表示単位（全体／男性／女性）・指標（2026年実績／前年差／前年比）をワンクリックで切替
- 指標に応じて自動で色分けされるスコアカード（約30教会）
- 前年比 上位5／下位5教会のハイライト
- 地域・教会規模による複数条件フィルターと7種類のソート
- 前年比ランキング・人数ランキング・前年差ランキング・地域別／規模別平均・KPI別比較の8種のインタラクティブなグラフ
- 教会別の詳細画面（2025→2026比較・男女比較・全国／地域／規模平均との差・自動分析コメント）
- ダークモード対応・レスポンシブ対応
- `robots.txt` と `noindex` メタタグにより検索エンジンには非公開

## ローカル開発

```bash
npm install
npm run dev
```

`http://localhost:5173` で起動します。

## データの更新

Excelファイル（教会実績・教会マスタの2シート構成）を更新したら、以下を実行して `src/data/churches.json` を再生成してください。

```bash
python3 scripts/convert_excel.py 前年比.xlsx src/data
```

（`openpyxl` が必要です：`pip install openpyxl`）

## GitHub Pagesへのデプロイ

### 1. リポジトリの準備

1. このフォルダの中身をそのままGitHubの新規リポジトリにpushしてください。
2. `vite.config.ts` の `base` を、実際のリポジトリ名に合わせて変更してください。

   ```ts
   base: process.env.VITE_BASE_PATH || '/あなたのリポジトリ名/',
   ```

   `https://<ユーザー名>.github.io/<リポジトリ名>/` で公開する場合、`<リポジトリ名>` の部分を実際の値に置き換えます。同梱の `.github/workflows/deploy.yml` はビルド時にリポジトリ名を自動で `VITE_BASE_PATH` に渡すため、通常はワークフロー側の変更は不要です。

### 2. GitHub Pages の設定

1. リポジトリの **Settings → Pages** を開く
2. **Source** を「GitHub Actions」に設定する
3. `main` ブランチに push すると、同梱の `.github/workflows/deploy.yml` が自動的に
   - 依存関係のインストール（`npm ci`）
   - ビルド（`npm run build`）
   - `dist/` の GitHub Pages への公開
   を実行します。
4. 数分後、`https://<ユーザー名>.github.io/<リポジトリ名>/` で公開されます。

### 3. 検索エンジン非公開について

`public/robots.txt`（`Disallow: /`）と `index.html` の `<meta name="robots" content="noindex, nofollow">` により、一般的なクローラーはインデックスしません。ただし GitHub Pages のURLは非公開ではなく「知っている人だけがアクセスできる」形になる点にご留意ください（アクセス制限が必要な場合はGitHub Pages自体のアクセス制御機能や、社内向けVPN等の併用をご検討ください）。

## ディレクトリ構成

```
church-dashboard/
├── scripts/convert_excel.py   # Excel → JSON 変換スクリプト
├── src/
│   ├── data/churches.json     # 変換済みデータ（ビルド時にバンドル）
│   ├── types.ts                # 型定義
│   ├── lib/                    # 前年比計算・色分け・分析コメント生成ロジック
│   ├── context/                 # グローバル状態（KPI・性別・指標・フィルター・テーマ）
│   ├── components/              # カード・グラフ・フィルターなどのUIパーツ
│   └── pages/                   # ダッシュボード／教会詳細／404
├── .github/workflows/deploy.yml # GitHub Pages 自動デプロイ
└── DESIGN.md                    # 設計書
```
