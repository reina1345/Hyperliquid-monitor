'use client';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { PositionList } from '@/components/dashboard/PositionList';
import { AccountSummary } from '@/components/dashboard/AccountSummary';
import { useState } from 'react';

// Create a client
const queryClient = new QueryClient();

function DashboardContent() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['positions'],
    queryFn: async () => {
      const res = await fetch('/api/positions');
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
    refetchInterval: 15000, // 15秒ごとに更新
  });

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-red-50 text-red-500 p-8 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-2">Error</h2>
        <p>Failed to load dashboard data. Please check your configuration.</p>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 space-y-8">
        <header className="flex justify-between items-center pb-6 border-b border-gray-200">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Hyperliquid Dashboard</h1>
          <div className="text-sm text-gray-500">
            Auto-refreshing every 15s
          </div>
        </header>

        <section>
          <AccountSummary account={data.account} />
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Open Positions</h2>
          <PositionList positions={data.positions} />
        </section>
      </div>
    </main>
  );
}

export default function DashboardPage() {
  // queryClientをコンポーネント外で定義するとSSRで問題になる可能性があるため、
  // useStateでクライアントサイドでのみインスタンスを保持する方法もありますが、
  // ここではシンプルにコンポーネント外のインスタンスを使用します（'use client'なので）。
  // 厳密には useState(() => new QueryClient()) が推奨されます。

  const [client] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={client}>
      <DashboardContent />
    </QueryClientProvider>
  );
}
