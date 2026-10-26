import { useEffect } from 'react';
import { NavLink } from '@/components/ui/TransitionLink';
import { navigation, site } from '@/content/site';
import { Button } from '@/components/ui/Button';

interface MobileMenuProps {
  open: boolean;
}

/** Full-screen menu for small screens. */
export function MobileMenu({ open }: MobileMenuProps) {
  // Stop the page behind from scrolling while the menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <div
      id="mobile-menu"
      className={`fixed inset-0 z-40 flex flex-col justify-between bg-ink px-6 pb-10 pt-28 transition-opacity duration-300 md:hidden ${
        open ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
      aria-hidden={!open}
    >
      <nav aria-label="Mobile" className="flex flex-col gap-1">
        {[{ label: 'Home', to: '/' }, ...navigation].map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            tabIndex={open ? 0 : -1}
            className={({ isActive }) =>
              `font-display text-5xl py-2 transition-colors ${isActive ? 'text-brand' : 'text-white'}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="flex flex-col gap-6">
        <Button to="/contact" className="w-full !py-4">
          Book a production
        </Button>
        <div className="flex flex-col gap-1 text-sm text-white/70">
          <a href={`mailto:${site.email}`} tabIndex={open ? 0 : -1}>
            {site.email}
          </a>
          <a href={`tel:${site.phone.replace(/\s/g, '')}`} tabIndex={open ? 0 : -1}>
            {site.phone}
          </a>
        </div>
      </div>
    </div>
  );
}
