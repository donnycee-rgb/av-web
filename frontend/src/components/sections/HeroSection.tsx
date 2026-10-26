import { Link } from '@/components/ui/TransitionLink';
import { home } from '@/content/home';
import { projects } from '@/content/projects';
import { StackPanel } from '@/components/ui/StackPanel';
import { Button } from '@/components/ui/Button';
import { ViewfinderCard } from '@/components/media/ViewfinderCard';
import { ReelPlayer } from '@/components/media/ReelPlayer';
import { DirectorMark } from '@/components/ui/DirectorMark';

const stills = projects.map((p) => p.image);
// Each card cycles through its own set of stills
const pick = (...indexes: number[]) => indexes.map((i) => stills[i % stills.length]);

export function HeroSection() {
  const { hero } = home;

  return (
    <StackPanel tone="brand" first label="Introduction">
      <div className="relative flex h-full items-center justify-center overflow-hidden px-4 pt-20">
        {/* Viewfinder cards — fixed in place; only the stills inside change */}
        <div className="absolute left-[-8%] top-[14%] w-[40vw] sm:left-[4%] sm:top-[20%] sm:w-[19vw] sm:max-w-[270px]">
          <ViewfinderCard images={pick(0, 4, 1)} tilt={-8} delay={0} timecodeStart={12} label="Commercial" />
        </div>
        <div className="absolute bottom-[12%] left-[7%] hidden w-[18vw] max-w-[250px] md:block">
          <ViewfinderCard images={pick(2, 6)} tilt={6} delay={1.6} timecodeStart={208} label="Narrative" />
        </div>
        <div className="absolute bottom-[5%] right-[-8%] w-[42vw] sm:bottom-[10%] sm:right-[6%] sm:w-[18vw] sm:max-w-[250px]">
          <ViewfinderCard images={pick(3, 5)} tilt={-5} delay={0.8} timecodeStart={95} label="Music" />
        </div>

        {/* Showreel card with hand-drawn arrow */}
        <div className="absolute right-[5%] top-[20%] hidden w-[22vw] max-w-[320px] md:block">
          <Link to="/work" className="group block" aria-label="See our work">
            <div className="rotate-[5deg]">
              <ReelPlayer
                images={pick(7, 0, 3, 1)}
                interval={2600}
                className="aspect-video rounded-xl border-[5px] border-white shadow-2xl shadow-black/30 transition-transform group-hover:scale-[1.03]"
              />
            </div>
            <span className="mt-4 flex items-center justify-end gap-2 pr-6">
              <svg viewBox="0 0 60 40" className="h-8 w-12 animate-point text-white" fill="none" aria-hidden="true">
                <path d="M4 34c10 4 22-2 20-12-1-6-9-6-9 0 0 9 18 12 36-14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M44 6l7 2-3 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="font-display text-xl italic text-white group-hover:text-ink">{hero.showreelLabel}</span>
            </span>
          </Link>
        </div>

        {/* Title card */}
        <div className="relative z-10 flex max-w-3xl flex-col items-center text-center">
          <h1 className="flex flex-col items-center leading-[0.95]">
            {hero.lines.map((line, i) => (
              <span key={line.word} className="flex items-baseline gap-3 sm:gap-5">
                <span className="text-3xl text-white/90 sm:text-5xl">{line.lead}</span>
                <span className={`text-6xl sm:text-8xl lg:text-9xl ${i === 1 ? 'text-white' : 'text-ink'}`}>
                  {'mark' in line && line.mark ? (
                    <DirectorMark type="circle" colorClass="text-paper" delay={700}>
                      {line.word}
                    </DirectorMark>
                  ) : (
                    line.word
                  )}
                </span>
              </span>
            ))}
          </h1>
          <p className="mt-8 max-w-md text-base text-ink/80 sm:text-lg">{hero.intro}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button to={hero.primary.to} variant="dark">
              {hero.primary.label}
            </Button>
            <Button to={hero.secondary.to} variant="light">
              {hero.secondary.label}
            </Button>
          </div>
        </div>
      </div>
    </StackPanel>
  );
}
