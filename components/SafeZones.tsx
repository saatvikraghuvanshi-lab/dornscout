import React from 'react';
import { MapPin, ShieldCheck, Camera, Info } from 'lucide-react';
import { AppTheme } from '../types';

interface Props {
  theme: AppTheme;
}

export const SafeZones: React.FC<Props> = ({ theme }) => {
  const isLight = theme === 'light';
  const zones = [
    { id: '1', name: 'Library Lobby', description: '24/7 CCTV, Brightly lit, High security presence.', safetyRating: 'High', hasCameras: true, isInside: true },
    { id: '2', name: 'Student Union Plaza', description: 'Central hub, open visibility, busy during day.', safetyRating: 'High', hasCameras: true, isInside: false },
    { id: '3', name: 'Central Mess Entrance', description: 'Well populated area, good lighting.', safetyRating: 'High', hasCameras: true, isInside: false },
    { id: '4', name: 'Block 1 Common Area', description: 'Internal lobby, restricted hostel entry nearby.', safetyRating: 'Medium', hasCameras: true, isInside: true },
  ];

  const cardBg = isLight ? 'bg-white border-stone-200' : 'bg-gray-800 border-gray-700';
  const textColor = isLight ? 'text-stone-900' : 'text-white';

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex flex-col gap-2">
        <h2 className={`text-2xl font-bold flex items-center gap-2 ${textColor}`}>
          <MapPin className="text-blue-500" />
          Safe Meet-up Zones
        </h2>
        <p className="text-sm text-gray-400">Verified campus exchange points for secure transactions.</p>
      </div>

      <div className="grid gap-4">
        {zones.map(zone => (
          <div key={zone.id} className={`${cardBg} p-5 rounded-2xl border flex items-center justify-between group hover:border-blue-500/50 transition-all`}>
            <div className="flex gap-4 items-center">
              <div className={`p-3 rounded-xl ${isLight ? 'bg-blue-50 text-blue-600' : 'bg-blue-500/10 text-blue-400'}`}>
                <MapPin size={24} />
              </div>
              <div>
                <h3 className={`font-bold ${textColor}`}>{zone.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{zone.description}</p>
                <div className="flex gap-2 mt-2">
                  {zone.hasCameras && (
                    <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-green-500 bg-green-500/10 px-2 py-0.5 rounded">
                      <Camera size={10} /> CCTV Active
                    </span>
                  )}
                  <span className={`flex items-center gap-1 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${zone.isInside ? 'text-blue-500 bg-blue-500/10' : 'text-orange-500 bg-orange-500/10'}`}>
                    {zone.isInside ? 'Indoor' : 'Outdoor'}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right flex flex-col items-end gap-2">
              <div className="flex items-center gap-1 text-xs font-bold text-green-400">
                <ShieldCheck size={16} />
                <span>{zone.safetyRating} Safety</span>
              </div>
              <button className={`text-[10px] font-black uppercase p-2 rounded-lg ${isLight ? 'bg-stone-100 text-stone-600' : 'bg-gray-900 text-gray-400'}`}>View on Map</button>
            </div>
          </div>
        ))}
      </div>

      <div className={`p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 flex gap-3 items-start`}>
        <Info className="text-blue-500 shrink-0" size={20} />
        <p className="text-xs text-gray-500 leading-relaxed">
          <span className="font-bold text-blue-500 uppercase block mb-1">Safety Tip</span>
          Always meet in daylight or well-lit areas. The Arbitrator agent will automatically suggest these zones during the finalization of any deal.
        </p>
      </div>
    </div>
  );
};