import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { categories, categoryName, projects } from '@/content/projects';
import { pages } from '@/content/pages';
import { buildTracks, layoutClips, playbackOrder, timelineYears } from '@/lib/timeline';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { ProgramMonitor } from '@/components/media/ProgramMonitor';
import { Timeline } from '@/components/media/Timeline';

const tracks = buildTracks(categories);
const years = timelineYears(projects);
const clips = layoutClips(projects, tracks, years);
const PLAY_INTERVAL = 4500;
// Timeline length used for the timecode (the whole ruler = 10 minutes)
const TIMELINE_SECONDS = 600;

/**
 * The Work page as an editing suite: a program monitor and clip inspector on top,
 * a timeline of every project below. Soloing a track filters the work (?category=… in the URL).
 */
export function WorkEditor() {
  const copy = pages.work;
  const [params, setParams] = useSearchParams();
  const requested = params.get('category');
  const solo = categories.some((c) => c.id === requested) ? requested : null;

  // Clips that playback / next / previous move through — only the soloed track when soloing
  const order = useMemo(
    () => playbackOrder(solo ? clips.filter((c) => c.project.categoryId === solo) : clips, tracks),
    [solo],
  );

  // Start on the newest clip
  const [activeSlug, setActiveSlug] = useState(() => order[order.length - 1].project.slug);
  const [playing, setPlaying] = useState(false);
  const reduced = useReducedMotion();

  // If the active clip is hidden by a solo, jump to the first clip of the soloed track
  useEffect(() => {
    if (!order.some((c) => c.project.slug === activeSlug)) setActiveSlug(order[0].project.slug);
  }, [order, activeSlug]);

  const index = Math.max(0, order.findIndex((c) => c.project.slug === activeSlug));
  const activeClip = order[index] ?? order[0];
  const project = activeClip.project;

  const step = (direction: 1 | -1) => {
    setActiveSlug(order[(index + direction + order.length) % order.length].project.slug);
  };

  // Play: the playhead moves through the clips on its own
  useEffect(() => {
    if (!playing || reduced) return;
    const timer = window.setTimeout(() => step(1), PLAY_INTERVAL);
    return () => window.clearTimeout(timer);
    // Re-armed after every clip change, so each clip gets the full interval
  }, [playing, reduced, activeSlug, order]);

  const toggleSolo = (categoryId: string) => {
    setParams(solo === categoryId ? {} : { category: categoryId }, { replace: true, preventScrollReset: true });
  };

  const track = tracks.find((t) => t.category.id === project.categoryId);

  return (
    <section className="bg-ink pb-24 pt-28 text-white sm:pb-32 sm:pt-32">
      <Container>
        {/* Header */}
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-brand">{copy.eyebrow}</p>
            <h1 className="text-5xl leading-none sm:text-6xl">{copy.title}</h1>
          </div>
          <p className="text-white/60">{copy.intro}</p>
        </div>

        {/* Monitor + inspector */}
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <ProgramMonitor
            project={project}
            label={copy.monitorLabel}
            playing={playing && !reduced}
            positionSeconds={activeClip.left * TIMELINE_SECONDS}
            clipNumber={index + 1}
            clipCount={order.length}
            onPrev={() => step(-1)}
            onNext={() => step(1)}
            onTogglePlay={() => setPlaying((p) => !p)}
          />

          <aside aria-live="polite" className="flex flex-col rounded-2xl border border-white/10 bg-ink-soft p-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
              {track?.code} · {categoryName(project.categoryId)}
            </p>
            <div key={project.slug} className="flex flex-1 animate-fade-in flex-col">
              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-brand">{project.year}</p>
              <h2 className="mt-2 text-3xl leading-tight">{project.title}</h2>
              <p className="mt-4 text-white/70">{project.summary}</p>
              <div className="mt-auto pt-8">
                <Button to={`/work/${project.slug}`}>{copy.viewProject} →</Button>
              </div>
            </div>
          </aside>
        </div>

        {/* Timeline */}
        <div className="mt-4">
          <Timeline
            tracks={tracks}
            clips={clips}
            years={years}
            activeSlug={project.slug}
            solo={solo}
            onSelect={setActiveSlug}
            onSolo={toggleSolo}
            onStep={step}
          />
          <p className="mt-3 text-xs text-white/40">{copy.soloHint}</p>
        </div>
      </Container>
    </section>
  );
}
