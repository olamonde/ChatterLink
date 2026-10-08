import React from 'react';
import { LucideIcon, Search, FileQuestion, Users, Briefcase } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = FileQuestion,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`bg-[#111111] border border-dashed border-white/10 rounded-3xl p-10 text-center space-y-4 max-w-lg mx-auto ${className}`}
    >
      <div className="w-14 h-14 bg-indigo-950/80 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto shadow-md border border-indigo-800/50">
        <Icon className="w-7 h-7" />
      </div>
      <div className="space-y-1.5">
        <h3 className="text-base font-bold text-white font-display">{title}</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">{description}</p>
      </div>
      {actionLabel && onAction && (
        <div className="pt-2">
          <button
            onClick={onAction}
            className="px-5 py-2.5 text-xs font-bold text-slate-900 bg-white hover:bg-slate-200 rounded-xl transition-all shadow-md cursor-pointer"
          >
            {actionLabel}
          </button>
        </div>
      )}
    </div>
  );
};
