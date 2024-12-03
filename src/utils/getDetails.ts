import { useWallet } from "@solana/wallet-adapter-react"

export const getDetails = () =>{
  const wallet = useWallet();

  const details = async(signature : string ) : Promise<
}