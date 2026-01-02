import { SubscriptionClient } from '@nktkas/hyperliquid';
import { DiscordNotifier } from '../src/lib/discord/notifier';
import { Position } from '../src/types/position';
import dotenv from 'dotenv';
import path from 'path';

// 環境変数の読み込み (.env.local を優先、なければ .env)
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
if (!process.env.HYPERLIQUID_ACCOUNT_ADDRESS) {
  dotenv.config({ path: path.resolve(process.cwd(), '.env') });
}

const walletAddress = process.env.HYPERLIQUID_ACCOUNT_ADDRESS;
const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

if (!walletAddress || !webhookUrl) {
  console.error('Error: HYPERLIQUID_ACCOUNT_ADDRESS and DISCORD_WEBHOOK_URL are required.');
  process.exit(1);
}

const notifier = new DiscordNotifier(webhookUrl);
const client = new SubscriptionClient({ url: 'wss://api.hyperliquid.xyz/ws' });

console.log(`Starting background monitor for address: ${walletAddress}`);
console.log('Waiting for fills (trades)...');

async function main() {
  // 約定（Fills）の監視
  await client.subscribe({ type: 'userFills', user: walletAddress });

  // イベントリスナー
  client.on('userFills', async (event) => {
    if (event.data.user !== walletAddress) return;

    // 最新のFillデータ（通常は配列の最後の要素が最新か、あるいはdiffが来る）
    // event.data.fills はそのイベントに含まれるFillのリスト
    const fills = event.data.fills;

    if (!fills || fills.length === 0) return;

    console.log(`Detected ${fills.length} new fill(s)!`);

    for (const fill of fills) {
        const side = fill.side === 'B' ? 'BUY (Long/CloseShort)' : 'SELL (Short/CloseLong)';
        const size = parseFloat(fill.sz);
        const price = parseFloat(fill.px);
        const coin = fill.coin;
        const value = size * price;

        const message = `
**Coin**: ${coin}
**Side**: ${side}
**Size**: ${size.toFixed(4)}
**Price**: $${price.toFixed(2)}
**Value**: $${value.toFixed(2)}
**Fee**: $${fill.fee}
        `.trim();

        await sendFillAlert(coin, side, size, price, message);
    }
  });
}

async function sendFillAlert(coin: string, side: string, size: number, price: number, description: string) {
    const isBuy = side.includes('BUY');
    const color = isBuy ? 0x00FF00 : 0xFF0000; // Green or Red

    const embed = {
      title: `🔔 Fill Executed: ${coin}`,
      color,
      description: description,
      timestamp: new Date().toISOString(),
      footer: { text: 'Hyperliquid Monitor' },
    };

    try {
      await fetch(webhookUrl!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ embeds: [embed] }),
      });
      console.log(`Notification sent for ${coin}`);
    } catch (error) {
      console.error('Failed to send Discord notification:', error);
    }
}

main().catch(console.error);
