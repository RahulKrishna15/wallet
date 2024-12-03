import { createContext, useContext, useState, ReactNode } from "react";

// Define the Transaction interface
interface Transaction {
  recipient: string;
  amount: number;
}

// Define the VarContextType interface
interface VarContextType {
  balance: number;
  setBalance: (value: number) => void;

  recipient : string;
  setRecipient : (value :  string )=> void;

  transactions: Transaction[];
  setTransactions: (value: Transaction[]) => void;
}

// Create the context with an undefined default value
const VarContext = createContext<VarContextType | undefined>(undefined);

// Custom hook to access context
const useVarContext = () => {
  const context = useContext(VarContext);
  if (!context) {
    throw new Error("useVarContext must be used within a VarContextProvider");
  }
  return context;
};

// Context Provider component
const VarContextProvider = ({ children }: { children: ReactNode }) => {
  const [balance, setBalance] = useState<number>(0); // Define state with a number type
  const [recipient, setRecipient] = useState<string>("");
  const [transactions, setTransactions] = useState<Transaction[]>([]); // Define state for transactions

  // Context value with balance and transaction state
  const contextValue: VarContextType = {
    balance,
    setBalance,
    recipient,
    setRecipient,
    transactions,
    setTransactions,
  };

  return <VarContext.Provider value={contextValue}>{children}</VarContext.Provider>;
};

export { VarContextProvider, useVarContext };