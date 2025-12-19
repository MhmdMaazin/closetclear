
import React from 'react';
import { LayoutGrid, Shirt, PlusCircle, Sparkles, Plane, LogOut } from 'lucide-react';
import { Logo } from './Logo';

interface NavbarProps {
  currentView: string;
  onChangeView: (view: string) => void;
  userName?: string;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onChangeView, userName, onLogout }) => {
  const navItems = [
    { id: 'dashboard', label: 'Home', mobileLabel: 'Home', icon: LayoutGrid },
    { id: 'closet', label: 'My Closet', mobileLabel: 'Closet', icon: Shirt },
    { id: 'upload', label: 'Add Item', mobileLabel: 'Add', icon: PlusCircle },
    { id: 'stylist', label: 'AI Stylist', mobileLabel: 'Stylist', icon: Sparkles },
    { id: 'trips', label: 'Trips', mobileLabel: 'Trips', icon: Plane },
  ];

  return (
    <>
      {/* Mobile Top Header */}
      <div className="md:hidden fixed top-0 left-0 w-full h-14 bg-white/95 backdrop-blur-sm border-b border-slate-200 z-50 flex items-center justify-between px-4">
        <Logo showText={true} className="w-6 h-6" textClassName="text-base font-bold" />
        <button onClick={onLogout} className="p-2 text-slate-500 hover:bg-slate-100 rounded-full">
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Bar */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 z-50 md:relative md:border-t-0 md:w-64 md:h-screen md:flex md:flex-col md:border-r pb-safe">
        
        {/* Desktop Header/Logo */}
        <div className="hidden md:flex mb-8 px-6 mt-6">
          <Logo showText={true} className="w-8 h-8" textClassName="text-xl font-bold" />
        </div>

        {/* Nav Items Container */}
        <div className="grid grid-cols-5 gap-1 p-2 md:flex md:flex-col md:gap-2 md:p-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onChangeView(item.id)}
                className={`flex flex-col md:flex-row items-center justify-center md:justify-start py-1 md:px-4 md:py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'text-indigo-600 md:bg-indigo-50' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-6 h-6 md:w-5 md:h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                <span className={`text-[10px] md:text-sm md:ml-3 font-medium mt-1 md:mt-0 ${isActive ? 'font-semibold' : ''}`}>
                  <span className="md:hidden">{item.mobileLabel}</span>
                  <span className="hidden md:inline">{item.label}</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Desktop Profile Section */}
        <div className="hidden md:flex flex-col mt-auto px-4 pb-6 space-y-3">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl w-full border border-slate-100">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold shrink-0">
              {userName ? userName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="flex flex-col text-left overflow-hidden">
              <span className="text-sm font-semibold text-slate-900 truncate">{userName || 'User'}</span>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </nav>
    </>
  );
};
