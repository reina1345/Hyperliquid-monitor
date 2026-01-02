# 実装ガイド (Implementation Guide)

このドキュメントでは、Hyperliquid Dashboardの技術的な実装詳細について説明します。

## アーキテクチャ

### Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **API Client**: @nktkas/hyperliquid

### ディレクトリ構成

\`\`\`
src/
├── app/
│   ├── api/          # API Routes (Backend)
│   └── page.tsx      # Main Dashboard Page
├── components/
│   └── dashboard/    # UI Components
├── lib/
│   ├── hyperliquid/  # Hyperliquid API Client Logic
│   └── discord/      # Discord Notification Logic
└── types/            # TypeScript Interfaces
\`\`\`

## 主要コンポーネント詳細

### 1. Hyperliquid Client (`src/lib/hyperliquid/client.ts`)
Hyperliquid SDKをラップし、アプリケーションに必要なデータ形式に変換します。
- `getPerpsPositions`: 無期限先物のポジションを取得
- `getSpecialMarketPositions`: Pre-launch/Spotなどの特殊マーケットに対応（現在はプレースホルダー）
- `getAccountSummary`: マージン情報や口座残高を取得

### 2. API Route (`src/app/api/positions/route.ts`)
フロントエンドからのリクエストを受け、Hyperliquid Clientを使用してデータを取得します。
機密情報（APIキーが必要な場合など）をサーバーサイドで管理するために使用します。

### 3. Frontend (`src/app/page.tsx`)
React Queryを使用して15秒ごとにデータをポーリングします。
- `PositionList`: ポジション情報をテーブル形式で表示
- `AccountSummary`: アカウントの主要指標をカード形式で表示

### 4. Discord Notifier (`src/lib/discord/notifier.ts`)
Webhookを使用してDiscordにリッチな埋め込みメッセージを送信します。
アラートタイプに応じて色分けされたメッセージを生成します。

## 今後の拡張

- **WebSocket実装**: ポーリングからWebSocket接続への移行によるリアルタイム性の向上
- **チャート機能**: TradingView等のライブラリを使用した価格チャートの表示
- **自動売買ロジック**: 特定の条件下での自動オーダー機能の追加
