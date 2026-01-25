import React, { useState } from 'react';
import { UserProfile, AgentVibe, AppTheme, WishlistItem, PriceAlert } from '../types';
import { Settings, User as UserIcon, Palette, Sun, Moon, Cloud, Leaf, Flame, QrCode, BookOpen, Share2, Phone, CheckCircle, Mail, Edit3, Save, X, Heart, Bell, Plus, Trash2, ExternalLink } from 'lucide-react';

interface Props {
  profile: UserProfile;
  onUpdate: (profile: UserProfile) => void;
}

export const Profile: React.FC<Props> = ({ profile, onUpdate }) => {
  const [shareFeedback, setShareFeedback] = useState(false);
  const [isEditingIdentity, setIsEditingIdentity] = useState(false);
  const [editForm, setEditForm] = useState(profile);
  const [newWishItem, setNewWishItem] = useState('');
  const [newWishPrice, setNewWishPrice] = useState('');

  const themes: { id: AppTheme, label: string, icon: React.ReactNode, color: string }[] = [
    { id: 'dark', label: 'Classic Dark', icon: <Moon size={18} />, color: 'bg-gray-950' },
    { id: 'midnight', label: 'Midnight', icon: <Cloud size={18} />, color: 'bg-slate-950' },
    { id: 'emerald', label: 'Emerald', icon: <Leaf size={18} />, color: 'bg-teal-950' },
    { id: 'crimson', label: 'Crimson', icon: <Flame size={18} />, color: 'bg-rose-950' },
    { id: 'light', label: 'Pristine Light', icon: <Sun size={18} />, color: 'bg-slate-50' },
  ];

  const cardClass = profile.theme === 'light' ? 'bg-white border-stone-200 shadow-sm' : 'bg-gray-800 border-gray-700 shadow-xl';
  const inputClass = profile.theme === 'light' ? 'bg-stone-50 border-stone-200 text-stone-900' : 'bg-gray-900 border-gray-700 text-white';
  const labelClass = profile.theme === 'light' ? 'text-stone-500' : 'text-gray-500';

  const addWishlist = () => {
    if (!newWishItem) return;
    const newItem: WishlistItem = { id: Date.now().toString(), itemName: newWishItem, maxPrice: Number(newWishPrice) || 0 };
    onUpdate({ ...profile, wishlist: [...(profile.wishlist || []), newItem] });
    setNewWishItem('');
    setNewWishPrice('');
  };

  const removeWishlist = (id: string) => {
    onUpdate({ ...profile, wishlist: (profile.wishlist || []).filter(i => i.id !== id) });
  };

  const handleQRUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdate({ ...profile, upiQR: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleShare = async () => {
    // Determine the most reliable URL to share
    let shareUrl = window.location.href;
    
    // If we're in a sandboxed/iframe environment, window.location.href might be 'about:srcdoc'
    // which is an invalid URL for sharing. We try to find a valid base.
    if (!shareUrl.startsWith('http')) {
      // Fallback to the current origin if available, otherwise a default
      shareUrl = window.origin.startsWith('http') ? window.origin : 'https://dormscout.app';
    }

    const shareData = {
      title: 'DormScout',
      text: 'Check out the DormScout marketplace for students!',
      url: shareUrl,
    };

    try {
      // Use Web Share API if available and the URL is "real"
      if (navigator.share && shareUrl.startsWith('http')) {
        await navigator.share(shareData);
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(`${shareData.text} ${shareUrl}`);
        setShareFeedback(true);
        setTimeout(() => setShareFeedback(false), 2000);
      }
    } catch (err) {
      // If sharing was cancelled or failed, copy to clipboard as final resort
      try {
        await navigator.clipboard.writeText(`${shareData.text} ${shareUrl}`);
        setShareFeedback(true);
        setTimeout(() => setShareFeedback(false), 2000);
      } catch (clipboardErr) {
        console.error('Sharing and clipboard fallback both failed:', clipboardErr);
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center justify-between">
        <h2 className={`text-2xl font-bold flex items-center gap-2 ${profile.theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
          <Settings className="text-blue-500" />
          Student Profile
        </h2>
        <div className="flex gap-2">
           <button 
            onClick={() => window.open(window.location.href.startsWith('http') ? window.location.href : '#', '_blank')}
            className={`p-2 rounded-xl border transition-all ${profile.theme === 'light' ? 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100' : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white'}`}
            title="Open in New Tab"
          >
            <ExternalLink size={20} />
          </button>
          <button 
            onClick={handleShare} 
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg active:scale-95"
          >
            {shareFeedback ? <CheckCircle size={18} /> : <Share2 size={18} />}
            {shareFeedback ? 'Link Copied!' : 'Share App'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className={`${cardClass} p-6 rounded-2xl border space-y-6 relative`}>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold flex items-center gap-2 text-blue-400"><UserIcon size={20} /> Identity Info</h3>
            {!isEditingIdentity ? (
              <button onClick={() => setIsEditingIdentity(true)} className={`text-[10px] font-black uppercase flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${profile.theme === 'light' ? 'bg-stone-100 text-stone-600 hover:bg-stone-200' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
                <Edit3 size={12} /> Edit Info
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => setIsEditingIdentity(false)} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg"><X size={16}/></button>
                <button onClick={() => { onUpdate(editForm); setIsEditingIdentity(false); }} className="p-1.5 text-green-400 hover:bg-green-500/10 rounded-lg"><Save size={16}/></button>
              </div>
            )}
          </div>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className={`text-[10px] font-bold uppercase mb-1 block ${labelClass}`}>Full Name</label>
                <input type="text" value={isEditingIdentity ? editForm.name : profile.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} readOnly={!isEditingIdentity} className={`w-full border rounded-xl px-4 py-2 focus:border-blue-500 outline-none text-sm transition-all ${inputClass}`} />
              </div>
              <div className="flex-1">
                <label className={`text-[10px] font-bold uppercase mb-1 block ${labelClass}`}>Reg No</label>
                <input type="text" value={isEditingIdentity ? editForm.campusId : profile.campusId} onChange={(e) => setEditForm({...editForm, campusId: e.target.value})} readOnly={!isEditingIdentity} className={`w-full border rounded-xl px-4 py-2 focus:border-blue-500 outline-none text-sm transition-all ${inputClass}`} />
              </div>
            </div>
            <div>
              <label className={`text-[10px] font-bold uppercase mb-1 block ${labelClass}`}>Course</label>
              <input type="text" value={isEditingIdentity ? editForm.course : profile.course} onChange={(e) => setEditForm({...editForm, course: e.target.value})} readOnly={!isEditingIdentity} className={`w-full border rounded-xl px-4 py-2 focus:border-blue-500 outline-none text-sm transition-all ${inputClass}`} />
            </div>
            <div>
              <label className={`text-[10px] font-bold uppercase mb-1 block ${labelClass}`}>Campus Email</label>
              <input type="email" value={profile.email} readOnly className={`w-full border rounded-xl px-4 py-2 outline-none text-sm opacity-60 cursor-not-allowed ${inputClass}`} />
            </div>
          </div>
        </div>

        <div className={`${cardClass} p-6 rounded-2xl border space-y-6`}>
          <h3 className="text-lg font-bold flex items-center gap-2 text-red-400"><Heart size={20} /> Wishlist Matcher</h3>
          <div className="space-y-4">
            <div className="flex gap-2">
              <input value={newWishItem} onChange={e => setNewWishItem(e.target.value)} placeholder="Item to track..." className={`flex-1 rounded-xl px-4 py-2 text-sm outline-none border focus:border-blue-500 transition-all ${inputClass}`} />
              <input type="number" value={newWishPrice} onChange={e => setNewWishPrice(e.target.value)} placeholder="Max ₹" className={`w-24 rounded-xl px-4 py-2 text-sm outline-none border focus:border-blue-500 transition-all ${inputClass}`} />
              <button onClick={addWishlist} className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 transition-all"><Plus size={20} /></button>
            </div>
            <div className="space-y-2">
              {(profile.wishlist || []).map(item => (
                <div key={item.id} className={`flex justify-between items-center p-3 rounded-xl ${profile.theme === 'light' ? 'bg-stone-50' : 'bg-gray-900/50'}`}>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">{item.itemName}</span>
                    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Limit: ₹{item.maxPrice}</span>
                  </div>
                  <button onClick={() => removeWishlist(item.id)} className="text-red-400 hover:text-red-300 p-2"><Trash2 size={16} /></button>
                </div>
              ))}
              {(!profile.wishlist || profile.wishlist.length === 0) && (
                <div className="text-center py-4 border-2 border-dashed border-gray-700/50 rounded-xl text-[10px] text-gray-500 uppercase font-black tracking-widest">Your wishlist is empty</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={`${cardClass} p-6 rounded-2xl border space-y-6`}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold flex items-center gap-2 text-purple-400"><Palette size={20} /> App Theme</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {themes.map((t) => (
            <button key={t.id} onClick={() => onUpdate({ ...profile, theme: t.id })} className={`p-4 rounded-2xl border flex flex-col items-center gap-3 transition-all ${profile.theme === t.id ? 'border-blue-500 bg-blue-500/10 shadow-lg scale-105' : 'border-transparent bg-gray-900/40 hover:bg-gray-900'}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.color} border border-white/10`}>{t.icon}</div>
              <span className={`text-[10px] font-black uppercase ${profile.theme === 'light' ? 'text-slate-700' : 'text-gray-300'}`}>{t.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};