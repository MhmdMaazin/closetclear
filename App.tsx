
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { ItemScanner } from './components/ItemScanner';
import { ClosetGallery } from './components/ClosetGallery';
import { StylistAI } from './components/StylistAI';
import { LandingPage } from './components/LandingPage';
import { Trips } from './components/Trips';
import { Auth } from './components/Auth';
import { ToastContainer } from './components/Toast';
import { ClothingItem } from './types';
import { getCurrentUser, getItems, logout, addItem, updateItem, deleteItem } from './services/appwrite';
import { useToast } from './hooks/useToast';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  // 'landing' | 'auth' | 'app'
  const [viewState, setViewState] = useState<'landing' | 'auth' | 'app'>('landing');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [currentView, setCurrentView] = useState('dashboard');
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toasts, removeToast, error } = useToast();

  // Check Session on Mount
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    const currentUser = await getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setViewState('app');
      loadItems(currentUser.$id);
    } else {
      setViewState('landing');
      setLoading(false);
    }
  };

  const loadItems = async (userId: string) => {
    const data = await getItems(userId);
    setItems(data);
    setLoading(false);
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setViewState('landing');
  };

  const handleAddItem = async (newItemData: ClothingItem, file?: File) => {
    if (!user) return;
    // Optimistic update (optional, but waiting for DB is safer for IDs)
    const savedItem = await addItem(newItemData, user.$id, file);
    setItems(prev => [savedItem, ...prev]);
    setCurrentView('closet');
  };

  const handleUpdateItem = async (updatedItem: ClothingItem) => {
    // Optimistic
    setItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
    await updateItem(updatedItem);
  };

  const handleDeleteItem = async (itemId: string) => {
    // Optimistic
    setItems(prev => prev.filter(item => item.id !== itemId));
    await deleteItem(itemId);
  };

  const handleNavigation = (view: string) => {
    setCurrentView(view);
  };

  const renderAppView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard items={items} userName={user?.name || 'User'} onError={error} />;
      case 'closet':
        return <ClosetGallery items={items} onUpdateItem={handleUpdateItem} onDeleteItem={handleDeleteItem} />;
      case 'upload':
        return <ItemScanner onAddItem={handleAddItem} onCancel={() => setCurrentView('dashboard')} onError={error} />;
      case 'stylist':
        return <StylistAI items={items} />;
      case 'trips':
        return <Trips items={items} />;
      default:
        return <Dashboard items={items} userName={user?.name || 'User'} onError={error} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (viewState === 'landing') {
    return (
      <LandingPage 
        onGetStarted={() => { setAuthMode('signup'); setViewState('auth'); }} 
        onLogin={() => { setAuthMode('login'); setViewState('auth'); }}
      />
    );
  }

  if (viewState === 'auth') {
    return <Auth initialMode={authMode} onSuccess={checkSession} />;
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Navbar 
        currentView={currentView} 
        onChangeView={handleNavigation} 
        userName={user?.name} 
        onLogout={handleLogout}
      />
      <main className="flex-1 overflow-hidden h-screen overflow-y-auto pt-14 md:pt-0">
        {renderAppView()}
      </main>
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
};

export default App;
