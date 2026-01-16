import React from 'react';
import { Briefcase, Star, Search, Plus, Cpu, Scissors, BookOpen, PenTool } from 'lucide-react';
import { AppTheme, MarketplaceItem } from '../types';

interface Props {
  theme: AppTheme;
  onNegotiate: (item: MarketplaceItem) => void;
  onAddNew: () => void;
}

export const ServicesHub: React.FC<Props> = ({ theme, onNegotiate, onAddNew }) => {
  const isLight = theme === 'light';
  const cardBg = isLight ? 'bg-white border-stone-200' : 'bg-gray-800 border-gray-700';
  const textColor = isLight ? 'text-stone-900' : 'text-white';

  // For now, this is empty as requested until real services are added
  const services: MarketplaceItem[] = [];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className={`text-2xl font-bold flex items-center gap-2 ${textColor}`}>
            <Briefcase className="text-indigo-500" />
            Entrepreneur Hub
          </h2>
          <p className="text-sm text-gray-400">Student-led services and creative ventures.</p>
        </div>
        <button 
          onClick={onAddNew}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg"
        >
          <Plus size={18} /> Register Service
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: <Cpu />, label: 'Tech Repair', count: 0 },
          { icon: <Scissors />, label: 'Style & Groom', count: 0 },
          { icon: <BookOpen />, label: 'Tutoring', count: 0 },
          { icon: <PenTool />, label: 'Design', count: 0 },
        ].map((cat, i) => (
          <div key={i} className={`${cardBg} p-4 rounded-2xl border flex flex-col items-center gap-2 group hover:border-indigo-500/50 transition-all cursor-pointer`}>
            <div className={`p-3 rounded-xl ${isLight ? 'bg-indigo-50 text-indigo-600' : 'bg-indigo-500/10 text-indigo-400'} group-hover:scale-110 transition-transform`}>
              {cat.icon}
            </div>
            <span className={`text-xs font-bold ${textColor}`}>{cat.label}</span>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-black">{cat.count} listings</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center justify-center p-20 text-center space-y-4 border-2 border-dashed border-gray-700/50 rounded-3xl">
        <div className="w-16 h-16 bg-indigo-500/10 text-indigo-500 rounded-full flex items-center justify-center">
          <Briefcase size={32} />
        </div>
        <div>
          <h3 className={`text-lg font-bold ${textColor}`}>No Active Services</h3>
          <p className="text-sm text-gray-500 max-w-xs mt-1 mx-auto">Be the first to list your student venture! Whether it's coding, hair-cutting, or laundry—register now.</p>
        </div>
        <button onClick={onAddNew} className="text-indigo-400 text-xs font-black uppercase tracking-widest hover:text-indigo-300 transition-colors">Start Listing Services →</button>
      </div>
    </div>
  );
};