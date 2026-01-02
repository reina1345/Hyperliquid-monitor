import { NextResponse } from 'next/server';
import { getHyperliquidClient } from '@/lib/hyperliquid/instance';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const client = getHyperliquidClient();
    const positions = await client.getAllPositions();
    const account = await client.getAccountSummary();

    return NextResponse.json({ positions, account });
  } catch (error) {
    console.error('Failed to fetch positions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch positions' },
      { status: 500 }
    );
  }
}
