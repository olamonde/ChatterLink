import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`bg-[#1f1f1f] rounded-md animate-shimmer ${className}`} />
  );
};

export const JobCardSkeleton: React.FC = () => {
  return (
    <div className="bg-[#111111] border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-24 rounded" />
        <Skeleton className="h-4 w-16 rounded" />
      </div>
      <Skeleton className="h-6 w-3/4 rounded" />
      <Skeleton className="h-4 w-full rounded" />
      <Skeleton className="h-4 w-2/3 rounded" />
      <div className="pt-3 border-t border-white/5 flex items-center justify-between">
        <Skeleton className="h-5 w-32 rounded" />
        <Skeleton className="h-9 w-28 rounded-xl" />
      </div>
    </div>
  );
};

export const TableRowSkeleton: React.FC = () => {
  return (
    <tr className="animate-pulse">
      <td className="py-4 px-6">
        <Skeleton className="h-4 w-36 mb-1" />
        <Skeleton className="h-3 w-24" />
      </td>
      <td className="py-4 px-6">
        <Skeleton className="h-4 w-28" />
      </td>
      <td className="py-4 px-6">
        <Skeleton className="h-4 w-20" />
      </td>
      <td className="py-4 px-6">
        <Skeleton className="h-6 w-24 rounded-full" />
      </td>
      <td className="py-4 px-6 text-right">
        <Skeleton className="h-8 w-20 ml-auto rounded" />
      </td>
    </tr>
  );
};
