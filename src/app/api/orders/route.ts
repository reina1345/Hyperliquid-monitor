import { NextResponse } from 'next/server';
import { HyperliquidClient } from '@/lib/hyperliquid/client';

export const dynamic = 'force-dynamic';

export async function GET() {
  const walletAddress = process.env.HYPERLIQUID_ACCOUNT_ADDRESS;

  if (!walletAddress) {
    return NextResponse.json({ error: 'Wallet address not configured' }, { status: 500 });
  }

  try {
    const client = new HyperliquidClient(walletAddress);
    const openOrders = await client.getOpenOrders();
    return NextResponse.json(openOrders);
  } catch (error) {
    console.error('Error fetching open orders:', error);
    return NextResponse.json({ error: 'Failed to fetch open orders' }, { status: 500 });
  }
}
