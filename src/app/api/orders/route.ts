import { NextResponse } from 'next/server';
import { getHyperliquidClient } from '@/lib/hyperliquid/instance';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const client = getHyperliquidClient();
    const openOrders = await client.getOpenOrders();
    return NextResponse.json(openOrders);
  } catch (error) {
    console.error('Error fetching open orders:', error);
    return NextResponse.json({ error: 'Failed to fetch open orders' }, { status: 500 });
  }
}
