/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from "react";
import { ImagePlus } from "lucide-react";
import {
  WalletMultiButton,
  WalletDisconnectButton,
} from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { createNFT } from "../../utils/createNFT";
import { toast, ToastContainer } from "react-toastify";
export default function CreateNFTForm() {
  const wallet = useWallet();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [symbol, setSymbol] = useState("");
  const [supply, setSupply] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const supplyNumber = parseInt(supply);
      if (isNaN(supplyNumber) || supplyNumber <= 0) {
        throw new Error("Invalid token supply");
      }
      const signature = await createNFT(
        wallet,
        name,
        description,
        symbol,
        imageUrl,
        supplyNumber
      );
      console.log("Transaction Signature:", signature);
      toast.success("Transaction Successfull");
    } catch (error) {
      console.error("Error creating NFT:", error);
      toast.error("Error in Creating Transaction");
    }
    console.log("Creating NFT:", { name, description, imageUrl });
  };

  return (
    <div>
      <div className="flex flex-row justify-end gap-3 mb-10 mt-5 mr-5">
        <WalletMultiButton />
        <WalletDisconnectButton />
      </div>
      <div className="bg-white rounded-xl shadow-md p-4 lg:p-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <ImagePlus className="text-purple-600" size={24} />
          <h2 className="text-lg lg:text-xl font-semibold text-gray-800">
            Create NFT
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              NFT Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 lg:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm lg:text-base"
              placeholder="Enter NFT name"
            />
          </div>

          <div>
            <label
              htmlFor="symbol"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Symbol
            </label>
            <input
              id="symbol"
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="w-full px-3 lg:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm lg:text-base"
              placeholder="Enter NFT name"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 lg:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm lg:text-base"
              rows={4}
              placeholder="Enter NFT description"
            />
          </div>

          <div>
            <label
              htmlFor="imageUrl"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Image URL
            </label>
            <input
              id="imageUrl"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3 lg:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm lg:text-base"
              placeholder="Enter image URL"
            />
          </div>

          <div>
            <label
              htmlFor="symbol"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Supply
            </label>
            <input
              id="supply"
              type="text"
              value={supply}
              onChange={(e) => setSupply(e.target.value)}
              className="w-full px-3 lg:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm lg:text-base"
              placeholder="Enter NFT name"
            />
          </div>

          {imageUrl && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Preview</p>
              <img
                src={imageUrl}
                alt="NFT Preview"
                className="w-full max-w-xs rounded-lg border border-gray-200"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-sm lg:text-base"
          >
            Create NFT
          </button>
        </form>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
}
