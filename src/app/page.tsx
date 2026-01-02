'use client';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { PositionList } from '@/components/dashboard/PositionList';
import { AccountSummary } from '@/components/dashboard/AccountSummary';
import { ModeToggle } from '@/components/theme-toggle';
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

  // 共通のヘッダー部分
  const Header = () => (
    <header className="flex justify-between items-center pb-6 border-b border-gray-200 dark:border-gray-800">
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Hyperliquid Dashboard</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Auto-refreshing every 15s
        </div>
      </div>
      <ModeToggle />
    </header>
  );

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-200">
      <div className="container mx-auto px-4 space-y-8">
        <Header />

        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}

        {error && (
          <div className="flex justify-center items-center py-20">
            <div className="bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-300 p-8 rounded-lg shadow border border-red-100 dark:border-red-900">
              <h2 className="text-xl font-bold mb-2">Error</h2>
              <p>Failed to load dashboard data. Please check your configuration.</p>
            </div>
          </div>
        )}

        {data && (
          <>
            <section>
              <AccountSummary account={data.account} />
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Open Positions</h2>
              <PositionList positions={data.positions} />
            </section>
          </>
        )}
      </div>
    </main>
  );
}

export default function DashboardPage() {
  const [client] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={client}>
      <DashboardContent />
    </QueryClientProvider>
  );
}
