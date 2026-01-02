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

## セットアップ (Windowsの方)

ダウンロードしたフォルダ内で以下の手順を行ってください。

1. **`setup.bat` をダブルクリック**
   - 必要なプログラム（依存関係）が自動的にインストールされます。
   - 「Installation complete!」と表示されたらウィンドウを閉じてください。

2. **環境変数の設定**
   - `.env` ファイルはそのままでも動作しますが、実際のデータを表示するには `.env.local` を作成してください。
   - `.env.example` をコピーして `.env.local` にリネームし、メモ帳などで開いてアドレスを入力します。

3. **`start.bat` をダブルクリック**
   - アプリケーションが起動します。
   - ブラウザで http://localhost:3000 にアクセスしてください。

---

## セットアップ (コマンドライン / Mac / Linux)

1. **リポジトリのクローン (またはダウンロード)**
   \`\`\`bash
   git clone <repository-url>
   cd <repository-directory>
   \`\`\`

2. **依存関係のインストール**
   **※重要: このコマンドを実行しないと `npm run dev` は動きません**
   \`\`\`bash
   npm install
   \`\`\`

3. **環境変数の設定**
   このプロジェクトにはデフォルト設定ファイル \`.env\` が含まれています。
   ダウンロード後すぐに動作確認できますが、実際のデータを表示するには \`.env.local\` を作成して上書きすることをお勧めします。

   **.env.local の作成 (推奨):**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

   作成した \`.env.local\` を開き、値を書き換えてください:
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
