import { Position } from '@/types/position';

export function PositionList({ positions }: { positions: Position[] }) {
  if (!positions || positions.length === 0) {
    return <div className="text-center p-8 text-gray-500 dark:text-gray-400">No open positions</div>;
  }

  return (
    <div className="overflow-x-auto shadow-md sm:rounded-lg border border-gray-200 dark:border-gray-700">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="px-6 py-3">Coin</th>
            <th className="px-6 py-3">Side</th>
            <th className="px-6 py-3 text-right">Size</th>
            <th className="px-6 py-3 text-right">Entry</th>
            <th className="px-6 py-3 text-right">Mark</th>
            <th className="px-6 py-3 text-right">P&L</th>
            <th className="px-6 py-3 text-right">Liquidation</th>
          </tr>
        </thead>
        <tbody>
          {positions.map((pos, i) => (
            <tr key={i} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">{pos.coin}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  pos.side === 'LONG'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                }`}>
                  {pos.side}
                </span>
              </td>
              <td className="px-6 py-4 text-right">{Math.abs(pos.size).toFixed(4)}</td>
              <td className="px-6 py-4 text-right">${pos.entryPrice.toFixed(2)}</td>
              <td className="px-6 py-4 text-right">${pos.markPrice.toFixed(2)}</td>
              <td className={`px-6 py-4 text-right font-semibold ${
                pos.unrealizedPnl >= 0
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}>
                ${pos.unrealizedPnl.toFixed(2)} ({pos.pnlPercentage.toFixed(2)}%)
              </td>
              <td className="px-6 py-4 text-right">
                {pos.liquidationPrice ? `$${pos.liquidationPrice.toFixed(2)}` : 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
