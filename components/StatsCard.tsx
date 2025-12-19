import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtext: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, subtext, icon: Icon, trend, trendValue }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-indigo-50 rounded-xl">
          <Icon className="w-6 h-6 text-indigo-600" />
        </div>
        {trend && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
            trend === 'up' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
          }`}>
            {trend === 'up' ? '↑' : '↓'} {trendValue}
          </span>
        )}
      </div>
      <h3 className="text-slate-500 text-sm font-medium mb-1 uppercase tracking-wide">{title}</h3>
      <div className="text-2xl font-bold text-slate-900 mb-1">{value}</div>
      <p className="text-xs text-slate-400">{subtext}</p>
    </div>
  );
};