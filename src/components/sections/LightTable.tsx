import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Link } from '@/components/ui/TransitionLink';
import { categories, categoryName, projects } from '@/content/projects';
import { pages } from '@/content/pages';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Container } from '@/components/ui/Container';
import { Sprockets } from '@/components/media/Sprockets';
import type { Project } from '@/types';

const FINE_POINTER = '(hover: hover) and (pointer: fine)';
/** Loupe size (radius, px) and magnification */
const LOUPE_RADIUS = 110;
const ZOOM = 2;
// How quickly the loupe catches up with the mouse each frame (0–1); lower = heavier glass
const EASE = 0.2;
/** Frames per strip before a category continues on a new strip */
const PER_STRIP = 4;
/** Each strip lies on the table at a slightly different angle */
const TILTS = [-1.2, 0.9, -0.6, 1.3, -0.9];

interface Strip {
  categoryId: string;
  first: boolean;
  frames: { project: Project; number: number }[];
}

/** Projects grouped by category, cut into strips of film */
function buildStrips(list: Project[]): Strip[] {
  let number = 0;
  return categories.flatMap((category) => {
    const items = list.filter((p) => p.categoryId === category.id).map((project) => ({ project, number: ++number }));
    const strips: Strip[] = [];
    for (let i = 0; i < items.length; i += PER_STRIP) {
      strips.push({ categoryId: category.id, first: i === 0, frames: items.slice(i, i + PER_STRIP) });
    }
    return strips;
  });
}

/**
 * The strips on the table. Drawn twice on desktop: as colour negatives (orange film base, inverted
 * images) for the table itself, and as positives for the view through the loupe.
 */
function Strips({ strips, negative, interactive }: { strips: Strip[]; negative: boolean; interactive: boolean }) {
  return (
    <div className="flex flex-wrap items-start gap-x-12 gap-y-10 sm:gap-y-12">
      {strips.map((strip, s) => (
        <div key={`${strip.categoryId}-${s}`} className="max-w-full">
          {/* Grease-pencil label on the table */}
          {strip.first && (
            <p className="mb-2 ml-2 -rotate-2 font-display text-xl italic text-brand-dark sm:text-2xl">{categoryName(strip.categoryId)}</p>
          )}
          <div
            className={`inline-block max-w-full shadow-[0_6px_18px_-8px_rgba(60,30,0,0.45)] ${negative ? 'bg-[#c8743a]/90' : 'bg-[#141110]'}`}
            style={{ transform: `rotate(${TILTS[s % TILTS.length]}deg)`, marginLeft: `${(s % 3) * 2.5}%` }}
          >
            <Sprockets className="[background-image:repeating-linear-gradient(90deg,transparent_0_8px,#f6efe2_8px_20px,transparent_20px_32px)]" />
            {/* Swipes sideways when a strip is wider than the screen (phones) */}
            <ul className="flex snap-x gap-2 overflow-x-auto px-3 [scrollbar-width:none]">
              {strip.frames.map(({ project, number }) => {
                const frame = (
                  <span className="relative block aspect-[3/2] w-full overflow-hidden bg-black">
                    <img
                      src={project.image}
                      alt=""
                      loading={interactive ? 'lazy' : 'eager'}
                      draggable={false}
                      className={`h-full w-full object-cover transition-[filter] duration-500 ${
                        negative ? '[filter:invert(1)_hue-rotate(180deg)_saturate(0.6)_contrast(0.85)] group-focus-visible:[filter:none]' : ''
                      }`}
                    />
                    {/* Orange mask of colour negative film */}
                    {negative && <span aria-hidden="true" className="absolute inset-0 bg-[#e29a55] mix-blend-multiply transition-opacity duration-500 group-focus-visible:opacity-0" />}
                  </span>
                );
                return (
                  <li key={project.slug} data-slug={project.slug} className="w-40 shrink-0 snap-start sm:w-52 lg:w-56">
                    {interactive ? (
                      <Link to={`/work/${project.slug}`} aria-label={`${project.title} — ${categoryName(project.categoryId)}, ${project.year}`} className="group block outline-none focus-visible:ring-2 focus-visible:ring-brand">
                        {frame}
                      </Link>
                    ) : (
                      frame
                    )}
                    {/* Edge print: frame number and title, as printed along the film's edge */}
                    <p className={`mt-1 truncate font-mono text-[9px] uppercase tracking-[0.18em] sm:text-[10px] ${negative ? 'text-[#5a2c08]' : 'text-[#f2b04a]'}`}>
                      AV {String(number).padStart(2, '0')}A ▸ {project.title}
                    </p>
                  </li>
                );
              })}
            </ul>
            <Sprockets className="[background-image:repeating-linear-gradient(90deg,transparent_0_8px,#f6efe2_8px_20px,transparent_20px_32px)]" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * The Work page as a light table: every project is a frame on strips of colour negative film, one
 * strip per kind of work. On desktop the cursor becomes a loupe — under the glass, frames show
 * magnified and as positives, with the project's name; a click opens it. On touch screens (and with
 * reduced motion) the frames are shown as positives. ?category=… keeps only one kind of work.
 */
export function LightTable() {
  const copy = pages.work;
  const [params, setParams] = useSearchParams();
  const requested = params.get('category');
  const solo = categories.some((c) => c.id === requested) ? requested : null;
  const strips = buildStrips(solo ? projects.filter((p) => p.categoryId === solo) : projects);

  const reduced = useReducedMotion();
  const [fine] = useState(() => window.matchMedia(FINE_POINTER).matches);
  const loupe = fine && !reduced;

  const tableRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<Project | null>(null);

  // The loupe follows the mouse with a little weight, and grows in / shrinks away at the table's edge.
  // Position and size reach the CSS as --lx, --ly, --r (and --lo, 0–1, for the rim) on the table.
  useEffect(() => {
    const table = tableRef.current;
    if (!loupe || !table) return;
    const mouse = { x: 0, y: 0, inside: false };
    const pos = { x: 0, y: 0, r: 0 };
    let frame = 0;

    const target = () => {
      const rect = table.getBoundingClientRect();
      return { x: mouse.x - rect.left, y: mouse.y - rect.top };
    };
    const tick = () => {
      const t = target();
      pos.x += (t.x - pos.x) * EASE;
      pos.y += (t.y - pos.y) * EASE;
      pos.r += ((mouse.inside ? LOUPE_RADIUS : 0) - pos.r) * EASE;
      table.style.setProperty('--lx', `${pos.x.toFixed(1)}px`);
      table.style.setProperty('--ly', `${pos.y.toFixed(1)}px`);
      table.style.setProperty('--r', `${pos.r.toFixed(1)}px`);
      table.style.setProperty('--lo', (pos.r / LOUPE_RADIUS).toFixed(3));
      // Near the table's bottom edge the name tag moves above the glass
      const above = pos.y > table.clientHeight - LOUPE_RADIUS - 80;
      table.style.setProperty('--tag-y', `${above ? -(LOUPE_RADIUS + 66) : LOUPE_RADIUS + 14}px`);
      frame = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      if (!mouse.inside) {
        // Enter: start the glass where the mouse is, rather than sliding in from the last spot
        mouse.inside = true;
        const t = { x: e.clientX - table.getBoundingClientRect().left, y: e.clientY - table.getBoundingClientRect().top };
        pos.x = t.x;
        pos.y = t.y;
      }
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      const slug = (e.target as Element).closest<HTMLElement>('[data-slug]')?.dataset.slug;
      setHovered((current) => (current?.slug === slug ? current : (projects.find((p) => p.slug === slug) ?? null)));
    };
    const onLeave = () => {
      mouse.inside = false;
      setHovered(null);
    };

    frame = requestAnimationFrame(tick);
    table.addEventListener('mousemove', onMove);
    table.addEventListener('mouseleave', onLeave);
    return () => {
      cancelAnimationFrame(frame);
      table.removeEventListener('mousemove', onMove);
      table.removeEventListener('mouseleave', onLeave);
    };
  }, [loupe]);

  const setSolo = (categoryId: string | null) => {
    setParams(categoryId ? { category: categoryId } : {}, { replace: true, preventScrollReset: true });
  };

  return (
    <section className="spotlight bg-ink pb-24 pt-28 text-white sm:pb-32 sm:pt-32">
      <Container>
        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-brand">{copy.eyebrow}</p>
            <h1 className="text-5xl leading-none sm:text-6xl">{copy.title}</h1>
            <p className="mt-4 text-white/60">{loupe ? copy.tableIntro : copy.tableIntroTouch}</p>
          </div>

          {/* Kind of work */}
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter work">
            {[{ id: null, name: copy.all }, ...categories].map((c) => (
              <button
                key={c.id ?? 'all'}
                type="button"
                aria-pressed={solo === c.id}
                onClick={() => setSolo(c.id)}
                className={`rounded-full border px-4 py-1.5 text-sm transition-colors duration-300 ${
                  solo === c.id ? 'border-brand bg-brand text-ink' : 'border-white/15 text-white/70 hover:border-white/40 hover:text-white'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* The light table */}
        <div
          ref={tableRef}
          className={`relative overflow-hidden rounded-3xl p-4 shadow-[0_0_120px_-30px_rgba(255,230,190,0.45)] sm:p-10 ${loupe ? 'cursor-none' : ''}`}
          style={{ '--lx': '0px', '--ly': '0px', '--r': '0px', background: TABLE_SURFACE } as CSSProperties}
        >
          <div key={solo ?? 'all'} className="animate-fade-in">
            <Strips strips={strips} negative={loupe} interactive />
          </div>

          {loupe && (
            <>
              {/* The view through the glass: the same table, magnified, as positives */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 p-4 sm:p-10"
                style={{
                  background: TABLE_SURFACE,
                  clipPath: `circle(calc(var(--r) / ${ZOOM}) at var(--lx) var(--ly))`,
                  transformOrigin: 'var(--lx) var(--ly)',
                  transform: `scale(${ZOOM})`,
                }}
              >
                <div key={solo ?? 'all'}>
                  <Strips strips={strips} negative={false} interactive={false} />
                </div>
              </div>

              {/* The loupe's rim, and the name of the frame under it */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-0 top-0"
                style={{ transform: 'translate3d(var(--lx), var(--ly), 0)' }}
              >
                <div
                  className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-[6px] border-[#1d1a17] shadow-[0_18px_40px_-10px_rgba(0,0,0,0.55),inset_0_0_0_1px_rgba(255,255,255,0.25),inset_0_0_24px_rgba(0,0,0,0.25)]"
                  style={{
                    opacity: 'var(--lo, 0)',
                    width: 'calc(var(--r) * 2)',
                    height: 'calc(var(--r) * 2)',
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.22), transparent 38%)',
                  }}
                />
                <div
                  className={`absolute left-0 top-0 w-max -translate-x-1/2 rounded-full bg-ink px-4 py-2 text-center shadow-lg transition-[opacity,translate,margin] duration-300 ease-out ${
                    hovered ? 'opacity-100' : 'translate-y-1 opacity-0'
                  }`}
                  style={{ marginTop: `var(--tag-y, ${LOUPE_RADIUS + 14}px)` }}
                >
                  {hovered && (
                    <>
                      <span className="block text-sm font-semibold text-white">{hovered.title}</span>
                      <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-brand">
                        {categoryName(hovered.categoryId)} · {hovered.year} · {copy.openHint}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </Container>
    </section>
  );
}

/** A lit light table: warm white, brightest in the middle, with a faint ruled grid */
const TABLE_SURFACE = [
  'linear-gradient(rgba(90,60,20,0.05) 1px, transparent 1px) 0 0 / 48px 48px',
  'linear-gradient(90deg, rgba(90,60,20,0.05) 1px, transparent 1px) 0 0 / 48px 48px',
  'radial-gradient(ellipse at 50% 40%, #fffaf1 0%, #f4ecdf 60%, #e6d9c4 100%)',
].join(', ');
