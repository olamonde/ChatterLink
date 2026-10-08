import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: number | string;
  sublabel?: string;
  icon?: LucideIcon;
  variant?: 'slate' | 'indigo' | 'emerald' | 'amber' | 'rose';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  sublabel,
  icon: Icon,
  variant = 'slate',
  onClick,
}) => {
  const variantStyles = {
    slate: {
      border: 'border-white/10',
      bg: 'bg-[#111111]',
      iconBg: 'bg-[#1a1a1a] text-slate-300',
      valueColor: 'text-white',
    },
    indigo: {
      border: 'border-white/10 hover:border-indigo-500/40',
      bg: 'bg-[#111111]',
      iconBg: 'bg-indigo-950/80 text-indigo-400 border border-indigo-800/50',
      valueColor: 'text-white',
    },
    emerald: {
      border: 'border-white/10 hover:border-emerald-500/40',
      bg: 'bg-[#111111]',
      iconBg: 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/50',
      valueColor: 'text-white',
    },
    amber: {
      border: 'border-white/10 hover:border-amber-500/40',
      bg: 'bg-[#111111]',
      iconBg: 'bg-amber-950/80 text-amber-400 border border-amber-800/50',
      valueColor: 'text-white',
    },
    rose: {
      border: 'border-white/10 hover:border-rose-500/40',
      bg: 'bg-[#111111]',
      iconBg: 'bg-rose-950/80 text-rose-400 border border-rose-800/50',
      valueColor: 'text-white',
    },
  };

  const style = variantStyles[variant];

  return (
    <div
      onClick={onClick}
      className={`relative p-5 rounded-2xl border ${style.border} ${style.bg} shadow-xl hover:shadow-2xl transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-3 mb-2">
        <span className="text-xs font-medium text-slate-400">{label}</span>
        {Icon && (
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${style.iconBg}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      <div className={`text-2xl font-bold tracking-tight tabular-nums font-display ${style.valueColor}`}>
        {value}
      </div>
      {sublabel && <div className="text-[11px] text-slate-400 mt-1">{sublabel}</div>}
    </div>
  );
};
