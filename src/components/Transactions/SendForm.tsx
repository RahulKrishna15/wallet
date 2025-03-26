import React, { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { validateSolanaAddress } from "../../utils/solana";
import { useVarContext } from "../../context/VarContext";
import {
  WalletMultiButton,
  WalletDisconnectButton,
} from "@solana/wallet-adapter-react-ui";
import { useSendSolana } from "../../utils/sendSolana";
import { toast, ToastContainer } from "react-toastify"; // Importing toast and ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import CSS for Toast
import { useWallet } from "@solana/wallet-adapter-react";

export default function SendForm() {
  const wallet = useWallet();
  const { sendSolana } = useSendSolana();
  const { recipient, setRecipient, transactions, setTransactions } =
    useVarContext();
  const [amount, setAmount] = useState<string>(""); // Changed to string for better input handling
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const success = useRef(false); // Using ref to keep track of transaction success
  const sign = useRef("");
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Validate recipient address
    if (!validateSolanaAddress(recipient)) {
      setError("Invalid Solana address");
      toast.error("Invalid Solana address");
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Please enter a valid amount");
      toast.error("Please enter a valid amount");
      return;
    }

    setIsLoading(true);

    try {
      const signature = await sendSolana(recipient, parsedAmount);
      console.log("Transaction Successful: ", signature);
      success.current = true;
      sign.current = signature;
      toast.success(`Transaction Successful!`);

      const newTransaction = {
        recipient: recipient,
        amount: parsedAmount,
      };
      setTransactions((prevTransactions: any) => [
        ...prevTransactions,
        newTransaction,
      ]);
    } catch (err) {
      console.error("Transaction failed: ", err);
      setError("Transaction failed. Please try again.");
      toast.error("Transaction failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-row justify-end gap-3 mb-10 mt-5 mr-5">
        <WalletMultiButton />
        <WalletDisconnectButton />
      </div>
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md">
        <div className="flex items-center gap-2 mb-6">
          <Send className="text-purple-600" size={24} />
          <h2 className="text-lg lg:text-xl font-semibold text-gray-800">
            Send SOL
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="recipient"
              className="block text-sm font-medium text-gray-700"
            >
              Recipient Address
            </label>
            <input
              id="recipient"
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter Solana address"
              required
            />
          </div>

          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700"
            >
              Amount (SOL)
            </label>
            <input
              id="amount"
              type="text" // Changed to text for flexibility in fractional inputs
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="0.00"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className={`w-full py-2 px-4 rounded-lg transition-colors text-white ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Send SOL"}
          </button>

          {success.current && (
            <div>
              <h2 className="text-green-600">Transaction Successful</h2>
              <h2 className="font-semibold underline">
                <a
                  href={`https://explorer.solana.com/tx/${sign.current}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Click To View The Transaction Details
                </a>
              </h2>
            </div>
          )}
        </form>

        {wallet.connected ? (
          transactions.map((transaction, index) => (
            <div
              key={index} // Provide a unique key prop, preferably a transaction ID if available
              className="bg-white rounded-xl shadow-md p-4 lg:p-6 max-w-2xl mx-auto mt-5"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg lg:text-xl font-semibold text-gray-800">
                  {`Address: ${transaction.recipient}`}
                </h2>
              </div>

              <div className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-700 mb-1">{`Sent`}</p>
                  <p className="text-xl lg:text-2xl font-bold text-purple-700">
                    {`${transaction.amount} SOL`}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <></>
        )}
      </div>
      {/* Add ToastContainer for displaying notifications */}
      <ToastContainer position="bottom-right" />
    </div>
  );
}
