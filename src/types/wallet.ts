export interface WalletBalance {
  sol: number;
}

export interface TokenBalance {
  symbol: string;
  amount: number;
  usdValue: number;
}

export interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'airdrop' | 'mint';
  amount: number;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
  address: string;
}