import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, ShieldCheck, Zap, Coins } from 'lucide-react';
import { AppTheme, UserProfile } from '../types';

interface Props {
  theme: AppTheme;
  profile: UserProfile;
}

export const Dashboard: React.FC<Props> = ({ theme, profile }) => {
  const isLight = theme === 'light';
  
  // Calculate real stats from profile
  const completedDealsCount = profile.completedDeals.length;
  const totalSaved = profile.completedDeals.reduce((acc, deal) => acc + (deal.type === 'bought' ? 100 : 0), 0); // Mock logic for savings per deal
  
  const stats = [
    { label: 'Active Deals', val: '0', icon: <Zap />, color: 'text-yellow-400' },
    { label: 'Spam Filtered', val: '0', icon: <ShieldCheck />, color: 'text-blue-400' },
    { label: 'Efficiency', val: '0%', icon: <Coins />, color: 'text-green-400' },
    { label: 'Rupees Saved', val: `₹${totalSaved}`, icon: <Coins />, color: 'text-red-400' },
  ];

  const chartData = profile.completedDeals.length > 2 ? [
    { name: 'Start', saves: 0 },
    ...profile.completedDeals.map((d, i) => ({ name: `Deal ${i+1}`, saves: (i+1) * 150 }))
  ] : [
    { name: 'N/A', saves: 0 },
    { name: 'N/A', saves: 0 },
  ];

  const cardBg = isLight ? 'bg-white border-stone-200' : 'bg-gray-800 border-gray-700';
  const textColor = isLight ? 'text-stone-900' : 'text-white';
  const subTextColor = isLight ? 'text-stone-500' : 'text-gray-400';

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <h2 className={`text-2xl font-bold flex items-center gap-2 ${textColor}`}>
          <Activity className="text-blue-500" />
          DormScout Intelligence
        </h2>
        <div className="px-3 py-1 bg-green-900/20 text-green-500 border border-green-500/30 rounded-full text-xs font-bold uppercase tracking-widest">
          Agent Monitoring
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className={`${cardBg} p-4 rounded-2xl border shadow-sm transition-colors duration-300`}>
            <div className={`mb-2 ${stat.color}`}>{stat.icon}</div>
            <div className={`text-2xl font-black ${textColor}`}>{stat.val}</div>
            <div className={`${subTextColor} text-[10px] font-bold uppercase tracking-wider`}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div className={`${cardBg} p-6 rounded-2xl border shadow-sm transition-colors duration-300`}>
        <h3 className={`text-sm font-black uppercase tracking-widest mb-6 ${textColor}`}>Savings Velocity (₹)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isLight ? "#E5E7EB" : "#374151"} vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke={isLight ? "#94A3B8" : "#9CA3AF"} 
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke={isLight ? "#94A3B8" : "#9CA3AF"} 
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isLight ? '#FFFFFF' : '#1F2937', 
                  border: `1px solid ${isLight ? '#E2E8F0' : '#374151'}`,
                  borderRadius: '12px',
                  fontSize: '12px'
                }}
                itemStyle={{ color: '#3B82F6' }}
              />
              <Line 
                type="monotone" 
                dataKey="saves" 
                stroke="#3B82F6" 
                strokeWidth={3} 
                dot={{ fill: '#3B82F6', r: 4, strokeWidth: 2, stroke: isLight ? '#FFF' : '#1F2937' }} 
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {profile.completedDeals.length < 2 && (
          <div className="mt-4 p-3 bg-blue-500/5 rounded-xl border border-blue-500/10 text-center">
             <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Awaiting deal data to visualize growth</p>
          </div>
        )}
      </div>
    </div>
  );
};