import { useEffect, useState } from 'react';
import './App.css'
import BalanceCard from './components/Balance/BalanceCard'
import { VarContextProvider } from "./context/VarContext";
import Sidebar from './components/Layout/Sidebar';
import MobileHeader from './components/Layout/MobileHeader';
import SendForm from './components/Transactions/SendForm';
import CreateNFTForm from './components/NFT/CreateNFTForm';
import 'react-toastify/dist/ReactToastify.css';  // Import Toast styles
import { toast, ToastContainer } from 'react-toastify';
import { useWallet } from '@solana/wallet-adapter-react';
function App() {
  const wallet = useWallet();
  const [activeSection, setActiveSection] = useState('balance');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  useEffect(()=>{
    if (wallet.connected) {
      toast.success("Wallet Connected!");
    } else {
      toast.error("Wallet Disconnected!");
    }
  },[wallet.connected])

  const renderContent = () => {
    switch (activeSection) {
      case 'balance':
        return <BalanceCard/>;
      case 'send':
        return <SendForm />;
      case 'create-nft':
        return <CreateNFTForm />;
      default:
        return <div>Section under construction</div>;
    }
  };


  return (
    <VarContextProvider>
      <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      <MobileHeader onMenuClick={() => setIsSidebarOpen(true)} />
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <main className="flex-1 p-4 lg:p-8 mt-0 lg:mt-0">
        {renderContent()}
      </main>
      <ToastContainer position='bottom-right' />
    </div>
    </VarContextProvider>
  )
}
export default App
