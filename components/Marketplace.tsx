
import React, { useState, useMemo } from 'react';
import { MarketplaceItem } from '../types';
import { ExternalLink, Shield, Search, Plus, TrendingUp, Users, ArrowDownUp } from 'lucide-react';

interface Props {
  items: MarketplaceItem[];
  onNegotiate: (item: MarketplaceItem) => void;
  onAddNew: () => void;
}

export const Marketplace: React.FC<Props> = ({ items, onNegotiate, onAddNew }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'WTS' | 'WTB'>('ALL');

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'ALL' || item.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [items, searchQuery, filterType]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Search className="text-blue-500" />
            Dorm Campus Feed
          </h2>
          <button 
            onClick={onAddNew}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg"
          >
            <Plus size={18} /> Post New
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder="Search DormScout Marketplace..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-blue-500/50 transition-all shadow-inner"
            />
          </div>
          <div className="flex bg-gray-900 border border-gray-800 p-1 rounded-2xl">
            {(['ALL', 'WTS', 'WTB'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  filterType === type ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {type === 'WTS' ? 'Selling' : type === 'WTB' ? 'Buying' : 'All'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-gray-800/40 backdrop-blur-sm rounded-2xl border border-gray-800 overflow-hidden hover:border-blue-500/30 transition-all group shadow-sm hover:shadow-xl relative">
            
            {item.highestBid && (
              <div className="absolute top-0 right-0 bg-yellow-500 text-black text-[10px] font-black px-3 py-1 rounded-bl-xl z-10 animate-pulse">
                CURRENT BID: ₹{item.highestBid}
              </div>
            )}

            <div className="p-4 flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-40 h-40 bg-gray-700 rounded-xl flex items-center justify-center relative overflow-hidden">
                <img 
                  src={item.image || `https://picsum.photos/seed/${item.id}/400`} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md text-[10px] px-2 py-0.5 rounded uppercase font-black text-white">
                  {item.type}
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold group-hover:text-blue-400 transition-colors">{item.title}</h3>
                    <div className="text-right">
                      <div className="text-xl font-black text-white">₹{item.price}</div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-tighter">{item.source}</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mt-1 line-clamp-2 leading-relaxed">{item.description}</p>
                </div>

                {/* Demand/Supply Indicators */}
                <div className="mt-4 flex flex-wrap gap-4 items-center">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-1 rounded-lg">
                    <Users size={14}/>
                    <span>{item.interestedBuyersCount} Buyers</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded-lg">
                    <TrendingUp size={14}/>
                    <span>{item.interestedSellersCount} Available</span>
                  </div>

                  <div className={`px-2 py-1 rounded-md text-[10px] uppercase font-bold flex items-center gap-1 ${
                    item.isVerified ? 'bg-green-900/30 text-green-400' : 'bg-gray-800 text-gray-500'
                  }`}>
                    <Shield size={12}/>
                    {item.isVerified ? 'Dorm Verified' : 'Unverified'}
                  </div>
                  
                  <button 
                    onClick={() => onNegotiate(item)}
                    className="ml-auto bg-gray-900 hover:bg-blue-600 border border-gray-700 hover:border-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all"
                  >
                    {item.highestBid ? 'Enter Bidding' : item.type === 'WTS' ? 'Negotiate' : 'Sell This'} <ArrowDownUp size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
