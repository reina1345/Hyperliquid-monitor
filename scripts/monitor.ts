import { SubscriptionClient, WebSocketTransport } from '@nktkas/hyperliquid';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
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

const transport = new WebSocketTransport();
const client = new SubscriptionClient({ transport });

console.log(`Starting background monitor for address: ${walletAddress}`);

async function main() {
  if (!walletAddress) return;

  // 1. Subscribe to Fills (Trades)
  console.log('Subscribing to userFills...');
  await client.userFills({ user: walletAddress }, async (data: any) => {
    // Debug logging to understand data structure
    // console.log('Raw userFills event:', JSON.stringify(data, null, 2));

    if (data.user && data.user !== walletAddress) return;

    // SDK unwraps the response, so 'data' might be the object containing 'fills'
    // or 'data' itself might be the wrapper.
    // Based on previous debugging, 'data' has 'fills' property.
    const fills = data.fills || [];

    if (fills.length > 0) {
        console.log(`Detected ${fills.length} fill(s).`);
        for (const fill of fills) {
            await handleFill(fill);
        }
    }
  });

  // 2. Subscribe to Order Updates (Placements, Cancels, etc.)
  console.log('Subscribing to orderUpdates...');
  await client.orderUpdates({ user: walletAddress }, async (updates: any) => {
    // console.log('Raw orderUpdates event:', JSON.stringify(updates, null, 2));

    // Updates is an array of objects: { order, status, statusTimestamp }
    if (Array.isArray(updates)) {
        for (const update of updates) {
            await handleOrderUpdate(update);
        }
    }
  });

  console.log('Monitoring active. Press Ctrl+C to exit.');
}

async function handleFill(fill: any) {
    const side = fill.side === 'B' ? 'BUY' : 'SELL';
    const size = parseFloat(fill.sz);
    const price = parseFloat(fill.px);
    const coin = fill.coin;
    const value = size * price;

    const message = `
**Coin**: ${coin}
**Side**: ${side}
**Size**: ${size}
**Price**: $${price.toFixed(2)}
**Value**: $${value.toFixed(2)}
**Fee**: $${fill.fee}
    `.trim();

    await sendDiscordAlert({
        title: `🔔 Trade Executed: ${coin}`,
        color: side === 'BUY' ? 0x00FF00 : 0xFF0000, // Green/Red
        description: message
    });
}

async function handleOrderUpdate(update: any) {
    const { order, status } = update;
    const coin = order.coin;
    const side = order.side === 'B' ? 'BUY' : 'SELL';
    const limitPx = parseFloat(order.limitPx);
    const size = parseFloat(order.sz);
    const type = order.orderType; // "Limit", "Market", etc. (might be object)

    // Parse order type string
    let typeStr = 'Unknown';
    if (typeof type === 'string') {
        typeStr = type;
    } else if (typeof type === 'object') {
        typeStr = Object.keys(type)[0]; // e.g., { limit: ... } -> "limit"
    }

    let title = '';
    let color = 0x808080; // Default Grey
    let shouldNotify = false;

    if (status === 'open') {
        title = `📝 Order Opened: ${coin}`;
        color = 0x3498db; // Blue
        shouldNotify = true;
    } else if (status === 'canceled') {
        title = `🚫 Order Canceled: ${coin}`;
        color = 0xff9900; // Orange
        shouldNotify = true;
    } else if (status === 'triggered') {
        title = `⚠️ Order Triggered: ${coin}`;
        color = 0xffff00; // Yellow
        shouldNotify = true;
    }
    // We ignore 'filled' here because 'userFills' handles the trade details better (fees, etc.)
    // If you want double notification, set shouldNotify = true for 'filled' too.

    if (shouldNotify) {
        const message = `
**Type**: ${typeStr}
**Side**: ${side}
**Size**: ${size}
**Price**: $${limitPx.toFixed(2)}
**Status**: ${status.toUpperCase()}
        `.trim();

        await sendDiscordAlert({
            title,
            color,
            description: message
        });
        console.log(`Notification sent for Order ${status}: ${coin}`);
    }
}

async function sendDiscordAlert(payload: { title: string, color: number, description: string }) {
    const embed = {
      title: payload.title,
      color: payload.color,
      description: payload.description,
      timestamp: new Date().toISOString(),
      footer: { text: 'Hyperliquid Monitor' },
    };

    try {
      await fetch(webhookUrl!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ embeds: [embed] }),
      });
    } catch (error) {
      console.error('Failed to send Discord notification:', error);
    }
}

main().catch(console.error);
