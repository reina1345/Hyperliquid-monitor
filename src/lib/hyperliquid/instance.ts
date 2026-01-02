import { HyperliquidClient } from './client';

// Global variable to store the instance in development to prevent GC/re-creation
// In production, normal singleton module caching works.
const globalForHyperliquid = global as unknown as { hyperliquidClient: HyperliquidClient };

export const getHyperliquidClient = () => {
  const walletAddress = process.env.HYPERLIQUID_ACCOUNT_ADDRESS;

  if (!walletAddress) {
    throw new Error('HYPERLIQUID_ACCOUNT_ADDRESS is not set');
  }

  if (!globalForHyperliquid.hyperliquidClient) {
    globalForHyperliquid.hyperliquidClient = new HyperliquidClient(walletAddress);
  }

  return globalForHyperliquid.hyperliquidClient;
};
