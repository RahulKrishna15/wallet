import { Connection, LAMPORTS_PER_SOL, PublicKey, clusterApiUrl } from "@solana/web3.js";

interface PublicAddress {
  address: string;
}

/**
 * Fetches the balance of a given Solana account address.
 * @param addressObj - An object containing the public address of the account.
 * @returns A promise that resolves to the account balance in SOL.
 */

export const getAccountBalance = async (addressObj: PublicAddress): Promise<number> => {
  const connection = new Connection(clusterApiUrl("devnet"));
  
  try {
    const publicKey = new PublicKey(addressObj.address);
    const lamports = await connection.getBalance(publicKey);
    const solBalance = lamports / LAMPORTS_PER_SOL; // Convert lamports to SOL
    return solBalance;
  } catch (error) {
    console.error("Error fetching balance:", error);
    throw new Error("Failed to fetch account balance. Please check the address and try again.");
  }
};