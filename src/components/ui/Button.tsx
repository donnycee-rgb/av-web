import type { ReactNode } from 'react';
import { Link } from '@/components/ui/TransitionLink';

type Variant = 'primary' | 'dark' | 'light' | 'outline' | 'outline-light';

interface ButtonProps {
  children: ReactNode;
  /** Internal route ("/contact") or external URL ("https://…") — renders a link */
  to?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: Variant;
  className?: string;
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-brand text-ink hover:bg-brand-light',
  dark: 'bg-ink text-white hover:bg-navy',
  light: 'bg-white text-ink hover:bg-mist',
  outline: 'border border-ink/20 text-ink hover:border-ink',
  'outline-light': 'border border-white/30 text-white hover:border-white',
};

const base =
  'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors duration-200';

export function Button({ children, to, onClick, type = 'button', variant = 'primary', className = '' }: ButtonProps) {
  const classes = `${base} ${variantClasses[variant]} ${className}`;

  if (to?.startsWith('http')) {
    return (
      <a href={to} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }
  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
