import { useWallet } from "@solana/wallet-adapter-react";
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";

export const useSendSolana = () => {
  const wallet = useWallet();

  const sendSolana = async (address: string, amount: number): Promise<string> => {
    if (!wallet.publicKey) {
      throw new Error("Wallet not connected");
    }

    // Convert SOL to lamports (1 SOL = 1,000,000,000 lamports)
    const lamports = Math.floor(amount * LAMPORTS_PER_SOL); 

    if (lamports <= 0) {
      throw new Error("Amount must be greater than 0 SOL.");
    }

    const connection = new Connection(clusterApiUrl("devnet"));
    const receiver = new PublicKey(address);

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: receiver,
        lamports,
      })
    );

    transaction.feePayer = wallet.publicKey;
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

    const signedTransaction = await wallet.signTransaction(transaction);
    const signature = await connection.sendRawTransaction(signedTransaction.serialize());
    console.log(`Transaction Signature: ${signature}`);
    return signature;
  };

  return { sendSolana };
};