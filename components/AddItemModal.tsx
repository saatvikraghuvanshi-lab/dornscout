import React, { useState } from 'react';
import { ListingType, MarketplaceItem, AppTheme } from '../types';
import { X, Camera, Plus, Package, Search } from 'lucide-react';
import { verifyItemImage } from '../services/geminiService';

interface Props {
  onClose: () => void;
  onAdd: (item: MarketplaceItem) => void;
  theme: AppTheme;
  currentUserId: string;
}

export const AddItemModal: React.FC<Props> = ({ onClose, onAdd, theme, currentUserId }) => {
  const [type, setType] = useState<ListingType>('WTS');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [isVerifying, setIsVerifying] = useState(false);
  const [image, setImage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);

    let isVerified = false;

    try {
      // 1. Vision Verification
      if (image && type === 'WTS') {
        const base64 = image.split(',')[1];
        const analysis = (await verifyItemImage(base64, description || title)) || '';
        isVerified = !analysis.toLowerCase().includes('scam') && !analysis.toLowerCase().includes('fake');
      }

      // 2. Local State Creation (No Firebase)
      const newItem: MarketplaceItem = {
        id: Math.random().toString(36).substr(2, 9),
        title,
        price: Number(price),
        description,
        category,
        source: 'Local',
        sellerId: currentUserId,
        sellerRating: 5.0,
        image: image || '',
        type,
        isVerified,
        interestedBuyersCount: type === 'WTS' ? 0 : 1,
        interestedSellersCount: type === 'WTS' ? 1 : 0
      };

      onAdd(newItem);
      onClose();
    } catch (err) {
      console.error('Submission failed', err);
    } finally {
      setIsVerifying(false);
    }
  };

  const bgClass = theme === 'light' ? 'bg-white' : 'bg-gray-900';
  const borderClass = theme === 'light' ? 'border-stone-200' : 'border-gray-700';
  const textClass = theme === 'light' ? 'text-stone-900' : 'text-white';
  const inputBgClass = theme === 'light' ? 'bg-stone-50' : 'bg-gray-800';

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[60] backdrop-blur-md">
      <div className={`${bgClass} w-full max-w-lg rounded-2xl border ${borderClass} overflow-hidden shadow-2xl transition-all duration-300`}>
        <div className={`p-4 border-b flex justify-between items-center ${theme === 'light' ? 'bg-stone-50 border-stone-100' : 'bg-gray-800/50 border-gray-800'}`}>
          <h2 className={`text-xl font-bold flex items-center gap-2 ${textClass}`}>
            <Plus className="text-blue-500" />
            Add to DormScout
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className={`${theme === 'light' ? 'bg-stone-100' : 'bg-gray-800'} p-1 rounded-xl flex`}>
            {(['WTS', 'WTB'] as const).map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                  type === t ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {t === 'WTS' ? <Package size={16} /> : <Search size={16} />} {t === 'WTS' ? 'Selling' : 'Buying'}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <input required value={title} onChange={e => setTitle(e.target.value)} placeholder="Product name" className={`w-full border rounded-xl px-4 py-2 focus:border-blue-500 outline-none ${inputBgClass} ${borderClass} ${textClass}`} />
            <div className="grid grid-cols-2 gap-4">
              <input required type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="₹0.00" className={`w-full border rounded-xl px-4 py-2 focus:border-blue-500 outline-none ${inputBgClass} ${borderClass} ${textClass}`} />
              <select value={category} onChange={e => setCategory(e.target.value)} className={`w-full border rounded-xl px-4 py-2 focus:border-blue-500 outline-none ${inputBgClass} ${borderClass} ${textClass}`}>
                <option>Electronics</option><option>Textbooks</option><option>Furniture</option><option>Dorm Supplies</option>
              </select>
            </div>
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Condition details..." className={`w-full border rounded-xl px-4 py-2 focus:border-blue-500 outline-none h-24 resize-none ${inputBgClass} ${borderClass} ${textClass}`} />
            <label className="flex-1 cursor-pointer group">
              <div className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center gap-2 group-hover:border-blue-500 transition-colors ${theme === 'light' ? 'bg-stone-50 border-stone-200' : 'bg-gray-800/50 border-gray-700'}`}>
                {image ? <img src={image} className="h-20 w-20 object-cover rounded-lg shadow-lg" alt="Preview" /> : <Camera size={24} className="text-gray-500 group-hover:text-blue-500" />}
                <span className="text-xs text-gray-500 font-medium">Upload for AI Verification</span>
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          </div>

          <button type="submit" disabled={isVerifying} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white font-black py-3 rounded-xl transition-all shadow-xl">
            {isVerifying ? 'AI Processing...' : 'Post to Campus Feed'}
          </button>
        </form>
      </div>
    </div>
  );
};