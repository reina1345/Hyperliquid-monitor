import { AccountSummary as AccountSummaryType } from '@/types/position';

export function AccountSummary({ account }: { account: AccountSummaryType }) {
  if (!account) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
        <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Account Value</div>
        <div className="mt-2 text-2xl font-bold text-gray-900">${account.accountValue.toFixed(2)}</div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
        <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Margin Used</div>
        <div className="mt-2 text-2xl font-bold text-gray-900">${account.totalMarginUsed.toFixed(2)}</div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
        <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Position</div>
        <div className="mt-2 text-2xl font-bold text-gray-900">${account.totalNtlPos.toFixed(2)}</div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
        <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Withdrawable</div>
        <div className="mt-2 text-2xl font-bold text-green-600">${account.withdrawable.toFixed(2)}</div>
      </div>
    </div>
  );
}
