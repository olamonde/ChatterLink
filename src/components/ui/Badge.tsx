import React from 'react';
import type { ApplicationStatus, JobStatus } from '../../types/index.js';

interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'info' | 'danger' | 'neutral' | 'indigo';
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className = '',
}) => {
  const variantStyles = {
    default: 'bg-[#1c1c1c] text-slate-300 border-white/10',
    indigo: 'bg-indigo-950/70 text-indigo-300 border-indigo-800/60',
    success: 'bg-emerald-950/70 text-emerald-300 border-emerald-800/60',
    warning: 'bg-amber-950/70 text-amber-300 border-amber-800/60',
    info: 'bg-sky-950/70 text-sky-300 border-sky-800/60',
    danger: 'bg-rose-950/70 text-rose-300 border-rose-800/60',
    neutral: 'bg-[#181818] text-slate-300 border-white/10',
  };

  const dotColors = {
    default: 'bg-slate-400',
    indigo: 'bg-indigo-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    info: 'bg-sky-500',
    danger: 'bg-rose-500',
    neutral: 'bg-slate-400',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-md border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
};

export const ApplicationStatusBadge: React.FC<{ status: ApplicationStatus; size?: 'sm' | 'md' }> = ({
  status,
  size = 'md',
}) => {
  switch (status) {
    case 'RECEIVED':
      return (
        <Badge variant="neutral" size={size} dot>
          Envoyée
        </Badge>
      );
    case 'REVIEWING':
      return (
        <Badge variant="warning" size={size} dot>
          En cours d'examen
        </Badge>
      );
    case 'SHORTLISTED':
      return (
        <Badge variant="indigo" size={size} dot>
          Présélectionnée
        </Badge>
      );
    case 'ACCEPTED':
      return (
        <Badge variant="success" size={size} dot>
          Acceptée
        </Badge>
      );
    case 'REJECTED':
      return (
        <Badge variant="danger" size={size} dot>
          Refusée
        </Badge>
      );
    default:
      return (
        <Badge variant="default" size={size}>
          {status}
        </Badge>
      );
  }
};

export const JobStatusBadge: React.FC<{ status: JobStatus; size?: 'sm' | 'md' }> = ({
  status,
  size = 'md',
}) => {
  switch (status) {
    case 'PUBLISHED':
      return (
        <Badge variant="success" size={size} dot>
          Publiée
        </Badge>
      );
    case 'DRAFT':
      return (
        <Badge variant="warning" size={size} dot>
          Brouillon
        </Badge>
      );
    case 'CLOSED':
      return (
        <Badge variant="neutral" size={size} dot>
          Fermée
        </Badge>
      );
    default:
      return (
        <Badge variant="default" size={size}>
          {status}
        </Badge>
      );
  }
};
