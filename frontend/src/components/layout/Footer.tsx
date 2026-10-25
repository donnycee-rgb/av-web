import { Link } from '@/components/ui/TransitionLink';
import { navigation, site } from '@/content/site';
import { Container } from '@/components/ui/Container';
import { Logo } from '@/components/ui/Logo';

export function Footer() {
  const socials = site.socials.filter((s) => s.url);
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-white">
      <Container className="py-16 sm:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo />
            <p className="mt-6 max-w-sm font-display text-2xl leading-snug text-white">
              Stories that move people, <span className="text-brand">framed and sounded with care.</span>
            </p>
          </div>

          <nav aria-label="Footer" className="md:col-span-3">
            <h2 className="mb-4 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Explore</h2>
            <ul className="flex flex-col gap-2.5 text-sm">
              {navigation.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-white/80 hover:text-brand">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-4">
            <h2 className="mb-4 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Get in touch</h2>
            <ul className="flex flex-col gap-2.5 text-sm text-white/80">
              <li>
                <a href={`mailto:${site.email}`} className="hover:text-brand">
                  {site.email}
                </a>
              </li>
              <li>
                <a href={`tel:${site.phone.replace(/\s/g, '')}`} className="hover:text-brand">
                  {site.phone}
                </a>
              </li>
              <li>{site.location}</li>
              {socials.map((s) => (
                <li key={s.platform}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="hover:text-brand">
                    {s.platform}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-white/10 pt-6 text-xs text-white/50">
          © {year} {site.name}. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}
