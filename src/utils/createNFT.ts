import {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import {
  TOKEN_2022_PROGRAM_ID,
  getMintLen,
  createInitializeMetadataPointerInstruction,
  createInitializeMintInstruction,
  TYPE_SIZE,
  LENGTH_SIZE,
  ExtensionType,
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
} from "@solana/spl-token";
import { createInitializeInstruction, pack } from "@solana/spl-token-metadata";
import { WalletContextState } from "@solana/wallet-adapter-react";

export const createNFT = async (
  wallet: WalletContextState,
  name: string,
  description: string,
  symbol: string,
  url: string,
  supply : number
): Promise<string> => {
  if (!wallet.publicKey) {
    throw new Error("Wallet not connected");
  }

  const connection = new Connection(clusterApiUrl("devnet"));
  const mintKeypair = Keypair.generate();

  const metadata = {
    mint: mintKeypair.publicKey,
    name: name,
    symbol: symbol,
    uri: url,
    additionalMetadata: [["description", description]],
  };

  const mintLen = getMintLen([ExtensionType.MetadataPointer]);
  const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;
  const lamports = await connection.getMinimumBalanceForRentExemption(
    mintLen + metadataLen
  );

  const transaction = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: wallet.publicKey,
      newAccountPubkey: mintKeypair.publicKey,
      space: mintLen,
      lamports,
      programId: TOKEN_2022_PROGRAM_ID,
    }),
    createInitializeMetadataPointerInstruction(
      mintKeypair.publicKey,
      wallet.publicKey,
      mintKeypair.publicKey,
      TOKEN_2022_PROGRAM_ID
    ),
    createInitializeMintInstruction(
      mintKeypair.publicKey,
      9,
      wallet.publicKey,
      null,
      TOKEN_2022_PROGRAM_ID
    ),
    createInitializeInstruction({
      programId: TOKEN_2022_PROGRAM_ID,
      mint: mintKeypair.publicKey,
      metadata: mintKeypair.publicKey,
      name: metadata.name,
      symbol: metadata.symbol,
      uri: metadata.uri,
      mintAuthority: wallet.publicKey,
      updateAuthority: wallet.publicKey,
    })
  );
  // console.log(transaction)
  // transaction.feePayer = wallet.publicKey;
  // transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  // transaction.partialSign(mintKeypair);
  // console.log(transaction)

  const associatedToken = getAssociatedTokenAddressSync(
    mintKeypair.publicKey,
    wallet.publicKey,
    false,
    TOKEN_2022_PROGRAM_ID,
  );

  transaction.add(
    createAssociatedTokenAccountInstruction(
      wallet.publicKey,
      associatedToken,
      wallet.publicKey,
      mintKeypair.publicKey,
      TOKEN_2022_PROGRAM_ID,
    ),
  );
  transaction.add(
    createMintToInstruction(mintKeypair.publicKey, associatedToken, wallet.publicKey, supply * LAMPORTS_PER_SOL, [], TOKEN_2022_PROGRAM_ID)
);

  const {blockhash} = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = wallet.publicKey;

  transaction.partialSign(mintKeypair)
  const signature = await wallet.sendTransaction(transaction, connection);
  console.log(signature)
  return signature;
};