import { Menu, Wallet } from 'lucide-react';

interface MobileHeaderProps {
  onMenuClick: () => void;
}

export default function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-white shadow-sm lg:hidden">
      <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
        <Wallet className="text-purple-600" />
        Solana Wallet
      </h1>
      <button
        onClick={onMenuClick}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Menu size={24} className="text-purple-600" />
      </button>
    </div>
  );
}