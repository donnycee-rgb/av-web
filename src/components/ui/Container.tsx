import type { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

/** Centres content and applies the site's side gutters. */
export function Container({ children, className = '' }: ContainerProps) {
  return <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10 ${className}`}>{children}</div>;
}
