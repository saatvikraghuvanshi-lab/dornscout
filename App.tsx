import React, { useState, useEffect } from 'react';
import { UserProfile, AgentVibe, MarketplaceItem, AppTheme } from './types';
import { Dashboard } from './components/Dashboard';
import { Marketplace } from './components/Marketplace';
import { Profile } from './components/Profile';
import { AgentChat } from './components/AgentChat';
import { AddItemModal } from './components/AddItemModal';
import { UserChats } from './components/UserChats';
import { ServicesHub } from './components/ServicesHub';
import { MOCK_ITEMS } from './constants';
import { Bot, LayoutDashboard, ShoppingBag, Settings, LogOut, ChevronRight, User, BookOpen, Mail, Lock, QrCode, Phone, AlertCircle, MessageSquare, Power, Briefcase, Bell } from 'lucide-react';

const STORAGE_KEYS = {
  USER: 'dormscout_current_user',
  USERS: 'dormscout_all_users',
  ITEMS: 'dormscout_items'
};

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'chats' | 'marketplace' | 'profile' | 'services'>('dashboard');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [signupStep, setSignupStep] = useState(1);
  const [errorNotification, setErrorNotification] = useState<string | null>(null);
  const [wishlistMatch, setWishlistMatch] = useState<string | null>(null);

  const [signupData, setSignupData] = useState({ name: '', course: '', phone: '', email: '', password: '', upiQR: '' });
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: '', name: 'Student', course: '', campusId: '', email: '', phone: '', budgetLimit: 2000,
    vibe: AgentVibe.SAVVY_SAVER, calendar: [], completedDeals: [], wishlist: [], priceAlerts: [], theme: 'dark'
  });
  
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [negotiatingItem, setNegotiatingItem] = useState<MarketplaceItem | null>(null);
  const [isAddingItem, setIsAddingItem] = useState(false);

  const showError = (msg: string) => {
    setErrorNotification(msg);
    setTimeout(() => setErrorNotification(null), 5000);
  };

  useEffect(() => {
    const initApp = () => {
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
      if (storedUser) {
        setUserProfile(JSON.parse(storedUser));
        setIsLoggedIn(true);
      }
      const storedItems = localStorage.getItem(STORAGE_KEYS.ITEMS);
      if (storedItems) setItems(JSON.parse(storedItems));
      else { setItems(MOCK_ITEMS); localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(MOCK_ITEMS)); }
      setIsLoading(false);
    };
    initApp();
  }, []);

  const validateEmail = (email: string) => {
    const lowerEmail = email.toLowerCase().trim();
    if (!lowerEmail.endsWith('@muj.manipal.edu')) {
      showError('Campus access restricted. Use @muj.manipal.edu email.');
      return false;
    }
    return true;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(loginEmail)) return;
    const allUsers = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const user = allUsers.find((u: any) => u.email === loginEmail.toLowerCase().trim() && u.password === loginPassword);
    if (user) {
      const { password, ...profile } = user;
      setUserProfile(profile);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(profile));
      setIsLoggedIn(true);
    } else showError('Invalid credentials. Please try again.');
  };

  const handleSignupSubmit = () => {
    if (!validateEmail(signupData.email)) return;
    const allUsers = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const existingUser = allUsers.find((u: any) => u.email === signupData.email.toLowerCase().trim());
    if (existingUser) {
      showError('Account already exists. Returning to login page.');
      setAuthMode('signin');
      setLoginEmail(signupData.email);
      return;
    }
    const userId = Math.random().toString(36).substr(2, 9);
    const newProfile: UserProfile = {
      id: userId, name: signupData.name, course: signupData.course, campusId: signupData.email.split('@')[0],
      email: signupData.email.toLowerCase().trim(), phone: signupData.phone, budgetLimit: 2000,
      vibe: AgentVibe.SAVVY_SAVER, calendar: [], completedDeals: [], wishlist: [], priceAlerts: [],
      theme: 'dark', upiQR: signupData.upiQR
    };
    allUsers.push({ ...newProfile, password: signupData.password });
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(allUsers));
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newProfile));
    setUserProfile(newProfile);
    setIsLoggedIn(true);
  };

  const handleSignOut = () => { localStorage.removeItem(STORAGE_KEYS.USER); setIsLoggedIn(false); };
  const handleLogOut = () => { localStorage.removeItem(STORAGE_KEYS.USER); setIsLoggedIn(false); };

  const updateProfile = (newProfile: UserProfile) => {
    setUserProfile(newProfile);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newProfile));
    const allUsers = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const userIdx = allUsers.findIndex((u: any) => u.id === newProfile.id);
    if (userIdx !== -1) { allUsers[userIdx] = { ...allUsers[userIdx], ...newProfile }; localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(allUsers)); }
  };

  const addItem = (item: MarketplaceItem) => {
    const updatedItems = [item, ...items];
    setItems(updatedItems);
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(updatedItems));
    
    // Wishlist check
    const match = userProfile.wishlist?.find(w => 
      item.title.toLowerCase().includes(w.itemName.toLowerCase()) && 
      (w.maxPrice === 0 || item.price <= w.maxPrice)
    );
    if (match) {
      setWishlistMatch(item.title);
      setTimeout(() => setWishlistMatch(null), 8000);
    }
  };

  const getThemeClasses = (theme: AppTheme) => {
    switch (theme) {
      case 'midnight': return 'bg-slate-950 text-slate-100';
      case 'emerald': return 'bg-teal-950 text-emerald-50';
      case 'crimson': return 'bg-rose-950 text-rose-50';
      case 'light': return 'bg-slate-50 text-slate-900';
      default: return 'bg-gray-950 text-gray-100';
    }
  };

  const getNavClasses = (theme: AppTheme) => {
    switch (theme) {
      case 'midnight': return 'bg-slate-900 border-slate-800';
      case 'emerald': return 'bg-teal-900 border-teal-800';
      case 'crimson': return 'bg-rose-900 border-rose-800';
      case 'light': return 'bg-white border-slate-200';
      default: return 'bg-gray-900 border-gray-800';
    }
  };

  if (isLoading) return <div className="min-h-screen bg-gray-950 flex items-center justify-center"><Bot size={48} className="text-blue-500 animate-bounce" /></div>;

  if (!isLoggedIn) return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${getThemeClasses(userProfile.theme)} transition-colors duration-500`}>
      {errorNotification && <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-full z-[100] animate-in slide-in-from-top-4">{errorNotification}</div>}
      <div className={`max-w-md w-full border rounded-3xl p-8 shadow-2xl relative overflow-hidden ${getNavClasses(userProfile.theme)}`}>
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center transform -rotate-6 shadow-xl mb-4"><Bot size={40} className="text-white" /></div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">DormScout</h1>
          <p className="text-gray-400 text-sm mt-1">Campus Arbitrator Hub</p>
        </div>
        {authMode === 'signin' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <input required type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="MUJ Email" className={`w-full rounded-xl px-4 py-3 outline-none ${userProfile.theme === 'light' ? 'bg-stone-100 border' : 'bg-gray-800 border-gray-700 border'}`} />
            <input required type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} placeholder="Password" className={`w-full rounded-xl px-4 py-3 outline-none ${userProfile.theme === 'light' ? 'bg-stone-100 border' : 'bg-gray-800 border-gray-700 border'}`} />
            <button type="submit" className="w-full bg-blue-600 text-white font-black py-4 rounded-xl shadow-xl hover:bg-blue-700 transition-all">Sign In</button>
            <button type="button" onClick={() => setAuthMode('signup')} className="w-full text-xs font-bold text-gray-500 mt-2">Create Student Account</button>
          </form>
        ) : (
          <div className="space-y-6">
            {signupStep === 1 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                <input value={signupData.name} onChange={e => setSignupData({...signupData, name: e.target.value})} placeholder="Full Name" className={`w-full rounded-xl px-4 py-3 outline-none ${userProfile.theme === 'light' ? 'bg-stone-100 border' : 'bg-gray-800 border-gray-700 border'}`} />
                <input value={signupData.course} onChange={e => setSignupData({...signupData, course: e.target.value})} placeholder="Course (e.g. B.Tech)" className={`w-full rounded-xl px-4 py-3 outline-none ${userProfile.theme === 'light' ? 'bg-stone-100 border' : 'bg-gray-800 border-gray-700 border'}`} />
                <button onClick={() => setSignupStep(2)} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2">Next <ChevronRight size={18}/></button>
              </div>
            )}
            {signupStep === 2 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                <input value={signupData.email} onChange={e => setSignupData({...signupData, email: e.target.value})} placeholder="MUJ Email" className={`w-full rounded-xl px-4 py-3 outline-none ${userProfile.theme === 'light' ? 'bg-stone-100 border' : 'bg-gray-800 border-gray-700 border'}`} />
                <input type="password" value={signupData.password} onChange={e => setSignupData({...signupData, password: e.target.value})} placeholder="Password" className={`w-full rounded-xl px-4 py-3 outline-none ${userProfile.theme === 'light' ? 'bg-stone-100 border' : 'bg-gray-800 border-gray-700 border'}`} />
                <button onClick={handleSignupSubmit} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl">Complete Setup</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen flex flex-col md:flex-row ${getThemeClasses(userProfile.theme)} transition-colors duration-300`}>
      {wishlistMatch && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-4 rounded-2xl shadow-2xl z-[100] animate-in slide-in-from-top-10 flex items-center gap-4 border border-white/20">
          <Bell className="animate-swing" />
          <div>
            <span className="font-black text-xs uppercase block tracking-widest">Wishlist Match!</span>
            <span className="text-sm font-medium">Someone posted "{wishlistMatch}" just now.</span>
          </div>
          <button onClick={() => { setWishlistMatch(null); setActiveTab('marketplace'); }} className="bg-white text-blue-600 px-3 py-1 rounded-lg text-xs font-bold">View</button>
        </div>
      )}

      <nav className={`w-full md:w-64 border-r flex flex-col sticky top-0 h-auto md:h-screen z-40 transition-colors duration-300 ${getNavClasses(userProfile.theme)}`}>
        <div className="p-6 border-b border-gray-800 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg shadow-lg"><Bot size={24} className="text-white" /></div>
          <span className={`font-black text-xl tracking-tighter ${userProfile.theme === 'light' ? 'text-stone-900' : 'text-white'}`}>DORMSCOUT</span>
        </div>
        <div className="flex-1 p-4 space-y-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
            { id: 'chats', label: 'Messages', icon: <MessageSquare size={18} /> },
            { id: 'marketplace', label: 'Dorm Feed', icon: <ShoppingBag size={18} /> },
            { id: 'services', label: 'Entrepreneur Hub', icon: <Briefcase size={18} /> },
            { id: 'profile', label: 'Profile', icon: <Settings size={18} /> },
          ].map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id as any)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${activeTab === item.id ? 'bg-blue-600 text-white shadow-lg' : userProfile.theme === 'light' ? 'text-slate-600 hover:bg-slate-100' : 'text-gray-400 hover:bg-gray-800'}`}>
              {item.icon} <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </div>
        <div className={`p-4 border-t ${userProfile.theme === 'light' ? 'border-slate-100' : 'border-gray-800'} space-y-1`}>
          <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-red-400 hover:bg-red-900/10 transition-colors font-bold text-xs"><LogOut size={16} /><span>Sign Out</span></button>
          <button onClick={handleLogOut} className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-gray-500 hover:text-gray-300 transition-colors font-bold text-[10px]"><Power size={12} /><span>Log Out</span></button>
        </div>
      </nav>
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          {activeTab === 'dashboard' && <Dashboard theme={userProfile.theme} profile={userProfile} />}
          {activeTab === 'chats' && <UserChats userProfile={userProfile} />}
          {activeTab === 'marketplace' && <Marketplace items={items} onNegotiate={setNegotiatingItem} onAddNew={() => setIsAddingItem(true)} />}
          {activeTab === 'services' && <ServicesHub theme={userProfile.theme} onNegotiate={setNegotiatingItem} onAddNew={() => setIsAddingItem(true)} />}
          {activeTab === 'profile' && <Profile profile={userProfile} onUpdate={updateProfile} />}
        </div>
      </main>
      {negotiatingItem && <AgentChat item={negotiatingItem} userProfile={userProfile} onClose={() => setNegotiatingItem(null)} />}
      {isAddingItem && <AddItemModal onClose={() => setIsAddingItem(false)} onAdd={addItem} theme={userProfile.theme} currentUserId={userProfile.id} />}
    </div>
  );
};

export default App;