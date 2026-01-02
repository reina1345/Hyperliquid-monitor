import { Position } from '@/types/position';

export class DiscordNotifier {
  constructor(private webhookUrl: string) {}

  async sendPositionAlert(
    position: Position,
    alertType: string,
    message: string
  ): Promise<void> {
    const color = this.getColor(alertType);
    const embed = {
      title: `🚨 ${alertType}: ${position.coin}`,
      color,
      fields: [
        { name: 'Side', value: position.side, inline: true },
        { name: 'Size', value: Math.abs(position.size).toString(), inline: true },
        { name: 'Entry Price', value: `$${position.entryPrice.toFixed(2)}`, inline: true },
        { name: 'Mark Price', value: `$${position.markPrice.toFixed(2)}`, inline: true },
        {
          name: 'P&L',
          value: `$${position.unrealizedPnl.toFixed(2)} (${position.pnlPercentage.toFixed(2)}%)`,
          inline: false
        },
      ],
      description: message,
      timestamp: new Date().toISOString(),
      footer: { text: 'Hyperliquid Position Bot' },
    };

    try {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ embeds: [embed] }),
      });

      if (!response.ok) {
        console.error('Failed to send Discord notification:', await response.text());
      }
    } catch (error) {
      console.error('Error sending Discord notification:', error);
    }
  }

  private getColor(alertType: string): number {
    const colors: Record<string, number> = {
      '清算警告': 0xFF0000,  // 赤
      '利益通知': 0x00FF00,  // 緑
      '損失警告': 0xFFA500,  // オレンジ
      '新規ポジション': 0x00BFFF,  // 水色
      'クローズ': 0x808080,  // グレー
    };
    return colors[alertType] || 0x7289DA;
  }
}
