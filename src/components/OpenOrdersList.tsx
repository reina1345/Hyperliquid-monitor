'use client';

import { useQuery } from '@tanstack/react-query';
import { OpenOrder } from '@/types/order';

async function fetchOpenOrders(): Promise<OpenOrder[]> {
  const res = await fetch('/api/orders');
  if (!res.ok) {
    throw new Error('Failed to fetch open orders');
  }
  return res.json();
}

export default function OpenOrdersList() {
  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['openOrders'],
    queryFn: fetchOpenOrders,
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  if (isLoading) return <div className="text-gray-500 animate-pulse">Loading orders...</div>;
  if (error) return <div className="text-red-500">Error loading orders</div>;
  if (!orders || orders.length === 0) return <div className="text-gray-500 text-center py-8">No open orders</div>;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-medium">
            <tr>
              <th className="px-6 py-3">Symbol</th>
              <th className="px-6 py-3">Side</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3 text-right">Size</th>
              <th className="px-6 py-3 text-right">Limit Price</th>
              <th className="px-6 py-3 text-right">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {orders.map((order) => {
              const isBuy = order.side === 'B';
              const sideColor = isBuy ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
              const date = new Date(order.timestamp).toLocaleString();

              return (
                <tr key={order.oid} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">{order.coin}</td>
                  <td className={`px-6 py-4 font-bold ${sideColor}`}>
                    {isBuy ? 'BUY' : 'SELL'}
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                    {order.orderType}
                    {order.reduceOnly && <span className="ml-2 text-xs bg-gray-200 dark:bg-gray-600 px-1 rounded">Reduce</span>}
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-gray-700 dark:text-gray-200">
                    {order.sz}
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-gray-700 dark:text-gray-200">
                    ${parseFloat(order.limitPx).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right text-xs text-gray-500 dark:text-gray-400">
                    {date}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
