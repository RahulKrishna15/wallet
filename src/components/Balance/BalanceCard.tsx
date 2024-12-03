import { Wallet } from "lucide-react";
import { getAccountBalance } from "../../utils/getAccountBalance";
import { useEffect, useState, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { useVarContext } from "/Users/rahulkrishna/Desktop/wallet/src/context/VarContext.tsx";

export default function BalanceCard() {
  const wallet = useWallet();
  const { balance, setBalance } = useVarContext();
  const [connected, setConnected] = useState(false);

  // Function to fetch balance
  const fetchBalance = useCallback(async () => {
    if (wallet.publicKey) {
      try {
        const solBalance = await getAccountBalance({
          address: wallet.publicKey.toBase58(),
        });
        setBalance(solBalance);
        console.log("has public key");
        setConnected(true);
      } catch (error) {
        console.error("Failed to fetch balance:", error);
      }
    } else {
      setConnected(false);
    }
  }, [wallet.publicKey, setBalance]);

  // Effect to fetch balance on wallet state change
  useEffect(() => {
    fetchBalance();
    // Show notification when the wallet is connected
  }, [fetchBalance]);

  return (
    <div>
      <div className="flex flex-row justify-end gap-3 mb-10 mt-5 mr-5">
        <WalletMultiButton />
        <WalletDisconnectButton />
      </div>
      <div className="bg-white rounded-xl shadow-md p-4 lg:p-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg lg:text-xl font-semibold text-gray-800">
            Wallet Balance
          </h2>
          <Wallet className="text-purple-800" size={24} />
        </div>

        <div className="space-y-4">
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-purple-700 mb-1">SOL Balance</p>
            <p className="text-xl lg:text-2xl font-bold text-purple-700">
              {connected ? `${balance} SOL` : "--"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
