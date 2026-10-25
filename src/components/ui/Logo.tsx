import { Link } from '@/components/ui/TransitionLink';
import { site } from '@/content/site';
import { LogoMark } from './LogoMark';

interface LogoProps {
  className?: string;
}

/** AV mark + studio name, linking home. */
export function Logo({ className = '' }: LogoProps) {
  return (
    <Link to="/" className={`group flex items-center gap-3 ${className}`} aria-label={`${site.name} home`}>
      <LogoMark className="h-9 w-auto" />
      <span className="leading-none">
        <span className="block whitespace-nowrap text-sm font-bold tracking-wider text-white">AV PRODUCTIONS</span>
        <span className="mt-1 hidden text-[10px] font-semibold uppercase tracking-[0.25em] text-brand sm:block">
          {site.tagline}
        </span>
      </span>
    </Link>
  );
}
