export interface Position {
  coin: string;
  size: number;
  entryPrice: number;
  markPrice: number;
  liquidationPrice: number | null | undefined;
  unrealizedPnl: number;
  marginUsed: number;
  leverage: number;
  side: 'LONG' | 'SHORT';
  pnlPercentage: number;
  distanceToLiquidation: number | null;
}

export interface AccountSummary {
  accountValue: number;
  totalMarginUsed: number;
  totalNtlPos: number;
  withdrawable: number;
}
