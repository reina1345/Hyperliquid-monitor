import { NextResponse } from 'next/server';
import { HyperliquidClient } from '@/lib/hyperliquid/client';

export async function GET() {
  try {
    const client = new HyperliquidClient(process.env.HYPERLIQUID_ACCOUNT_ADDRESS!);
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
