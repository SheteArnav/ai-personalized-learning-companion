import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = 'h-4 w-full' }) => {
  return (
    <div
      className={`animate-pulse bg-white/5 rounded-lg border border-white/5 ${className}`}
    />
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="p-6 rounded-2xl glass-card border border-white/5 space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-4 w-12 rounded-full" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-7 w-20 rounded-lg" />
        <Skeleton className="h-7 w-24 rounded-lg" />
      </div>
    </div>
  );
};
