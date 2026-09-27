'use client';

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'teal' | 'white' | 'slate' | 'rose';
  label?: string;
  className?: string;
  id?: string;
}

export default function LoadingSpinner({
  size = 'md',
  variant = 'teal',
  label,
  className = '',
  id,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    xs: 'w-3.5 h-3.5 border-2',
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-[2.5px]',
    lg: 'w-8 h-8 border-3',
    xl: 'w-12 h-12 border-4',
  }[size];

  const variantBorderClasses = {
    teal: 'border-teal-100 border-t-teal-700',
    white: 'border-white/25 border-t-white',
    slate: 'border-slate-200 border-t-slate-800',
    rose: 'border-rose-100 border-t-rose-600',
  }[variant];

  return (
    <div
      id={id || 'app-loading-spinner'}
      className={`inline-flex flex-col items-center justify-center gap-2.5 ${className}`}
      role="status"
      aria-label={label || 'Loading...'}
    >
      <div className="relative flex items-center justify-center">
        <span
          className={`clinic-spinner rounded-full ${sizeClasses} ${variantBorderClasses}`}
          style={{ willChange: 'transform' }}
        />
      </div>
      {label && (
        <span className="text-xs font-medium text-slate-500 tracking-normal select-none">
          {label}
        </span>
      )}
    </div>
  );
}
