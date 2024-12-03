import React from 'react';
import { Wallet, Send, Plus, History, Settings, X } from 'lucide-react';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ activeSection, onSectionChange, isOpen, onClose }: SidebarProps) {
  const navItems: NavItem[] = [
    { icon: <Wallet size={20} />, label: 'Balance', onClick: () => onSectionChange('balance') },
    { icon: <Send size={20} />, label: 'Send', onClick: () => onSectionChange('send') },
    { icon: <Plus size={20} />, label: 'Create NFT', onClick: () => onSectionChange('create-nft') },
    { icon: <History size={20} />, label: 'History', onClick: () => onSectionChange('history') },
    { icon: <Settings size={20} />, label: 'Settings', onClick: () => onSectionChange('settings') },
  ];

  const handleItemClick = (item: NavItem) => {
    item.onClick();
    onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <div className="p-4 flex items-center justify-between lg:justify-start">
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Wallet className="text-purple-600" />
            Solana Wallet
          </h1>
          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>
        <nav className="mt-8">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleItemClick(item)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors
                ${activeSection === item.label.toLowerCase()
                  ? 'bg-purple-50 text-purple-600 border-r-4 border-purple-600'
                  : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}