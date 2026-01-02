# Hyperliquid Dashboard

Next.jsベースのHyperliquidダッシュボードアプリケーションです。ポジションのリアルタイム表示やDiscord通知機能を備えています。

## 機能

- **リアルタイムポジション監視**: ポジション、PnL、清算価格などを一覧表示
- **アカウントサマリー**: 口座残高、使用マージンなどの重要指標を表示
- **Discord通知**: ポジションの変動や清算リスクをDiscordに通知（要設定）
- **レスポンシブデザイン**: Tailwind CSSによるモダンなUI
- **ダークモード**: 画面右上のトグルボタンでダークモード/ライトモードの切り替えが可能

## 必要要件

- Node.js 18以上
- Hyperliquidのアカウント（ウォレットアドレス）
- Discord Webhook URL（通知機能を使用する場合）

## セットアップ

1. **リポジトリのクローン**
   \`\`\`bash
   git clone <repository-url>
   cd <repository-directory>
   \`\`\`

2. **依存関係のインストール**
   \`\`\`bash
   npm install
   \`\`\`

3. **環境変数の設定**
   プロジェクトにはダミーの値が入った \`.env.local\` ファイルが含まれています。
   このファイルを開き、`HYPERLIQUID_ACCOUNT_ADDRESS` をご自身の実際のウォレットアドレスに書き換えてください。

   \`.env.local\` の編集:
   \`\`\`env
   HYPERLIQUID_ACCOUNT_ADDRESS=あなたのウォレットアドレス (例: 0x...)
   DISCORD_WEBHOOK_URL=あなたのDiscord Webhook URL (任意)
   \`\`\`

4. **開発サーバーの起動**
   \`\`\`bash
   npm run dev
   \`\`\`
   http://localhost:3000 にアクセスしてダッシュボードを確認します。

## 開発ガイド

詳細な実装内容については `IMPLEMENTATION_GUIDE.md` を参照してください。

## ライセンス

MIT
