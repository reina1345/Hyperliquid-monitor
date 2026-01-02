import { InfoClient, HttpTransport } from '@nktkas/hyperliquid';
import { Position, AccountSummary } from '@/types/position';

export class HyperliquidClient {
  private info: InfoClient;
  private walletAddress: string;

  constructor(walletAddress: string) {
    this.walletAddress = walletAddress;

    // トランスポートの初期化
    const transport = new HttpTransport();
    this.info = new InfoClient({ transport });
  }

  // 無期限先物のポジション取得
  async getPerpsPositions(): Promise<Position[]> {
    const [userState, allMids] = await Promise.all([
      // userState ではなく clearinghouseState を使用する可能性が高い
      this.info.clearinghouseState({ user: this.walletAddress }),
      this.info.allMids()
    ]);

    const positions: Position[] = [];

    // clearinghouseState の戻り値の型に合わせて調整
    // SDKの型定義によると assetPositions が含まれるはず
    const assetPositions = userState.assetPositions || [];

    for (const pos of assetPositions) {
      const position = pos.position;
      const coin = position.coin;
      const size = parseFloat(position.szi);

      if (size === 0) continue;

      const entryPrice = parseFloat(position.entryPx);
      const markPrice = parseFloat(allMids[coin] || '0');
      const side = size > 0 ? 'LONG' : 'SHORT';
      const unrealizedPnl = parseFloat(position.unrealizedPnl);
      const marginUsed = parseFloat(position.marginUsed);
      const leverage = typeof position.leverage.value === 'number'
        ? position.leverage.value
        : parseFloat(position.leverage.value);
      const liquidationPrice = position.liquidationPx ? parseFloat(position.liquidationPx) : null;

      // PnL % 計算
      const pnlPercentage = marginUsed !== 0 ? (unrealizedPnl / marginUsed) * 100 : 0;

      positions.push({
        coin,
        size,
        entryPrice,
        markPrice,
        liquidationPrice,
        unrealizedPnl,
        marginUsed,
        leverage,
        side,
        pnlPercentage,
        distanceToLiquidation: (liquidationPrice && markPrice)
          ? Math.abs(markPrice - liquidationPrice)
          : null,
      });
    }

    return positions;
  }

  // 特殊マーケット（Pre-launch/Spot）のポジション取得
  async getSpecialMarketPositions(): Promise<Position[]> {
    return [];
  }

  // 全ポジション取得
  async getAllPositions(): Promise<Position[]> {
    const [perps, special] = await Promise.all([
      this.getPerpsPositions(),
      this.getSpecialMarketPositions()
    ]);
    return [...perps, ...special];
  }

  // アカウント情報取得
  async getAccountSummary(): Promise<AccountSummary> {
    const userState = await this.info.clearinghouseState({ user: this.walletAddress });
    const summary = userState.marginSummary;

    return {
      accountValue: parseFloat(summary.accountValue),
      totalMarginUsed: parseFloat(summary.totalMarginUsed),
      totalNtlPos: parseFloat(summary.totalNtlPos),
      withdrawable: parseFloat(userState.withdrawable),
    };
  }
}
