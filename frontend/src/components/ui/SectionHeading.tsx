import { Link } from '@/components/ui/TransitionLink';

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  body?: string;
  link?: { label: string; to: string };
  /** Text colours for dark or light backgrounds */
  onDark?: boolean;
  className?: string;
}

/** Small label, serif title, optional line of text and an arrow link. */
export function SectionHeading({ eyebrow, title, body, link, onDark = false, className = '' }: SectionHeadingProps) {
  return (
    <div className={className}>
      <p className={`mb-4 text-xs font-semibold uppercase tracking-[0.25em] ${onDark ? 'text-brand' : 'text-brand-dark'}`}>
        {eyebrow}
      </p>
      <h2 className="text-4xl leading-[1.08] sm:text-5xl lg:text-6xl">{title}</h2>
      {body && <p className={`mt-5 max-w-md text-base sm:text-lg ${onDark ? 'text-white/70' : 'text-muted'}`}>{body}</p>}
      {link && (
        <Link
          to={link.to}
          className={`group mt-6 inline-flex items-center gap-2 text-sm font-semibold ${
            onDark ? 'text-white hover:text-brand' : 'text-ink hover:text-brand-dark'
          }`}
        >
          {link.label}
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
            →
          </span>
        </Link>
      )}
    </div>
  );
}
