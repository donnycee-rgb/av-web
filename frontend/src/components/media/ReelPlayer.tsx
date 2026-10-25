import { useCycle } from '@/hooks/useCycle';
import { useTimecode } from '@/hooks/useTimecode';

interface ReelPlayerProps {
  /** Stills played as a slow-zoom slideshow until a real showreel video exists */
  images: string[];
  /** When set, plays this muted, looping video instead of the slideshow */
  videoSrc?: string;
  /** Milliseconds each still stays on screen */
  interval?: number;
  /** Cinematic black bars top and bottom */
  letterbox?: boolean;
  /** Show the progress bar and timecode chrome */
  chrome?: boolean;
  className?: string;
}

/** A self-playing "showreel": video if available, otherwise stills with a Ken Burns drift. */
export function ReelPlayer({
  images,
  videoSrc,
  interval = 4000,
  letterbox = false,
  chrome = true,
  className = '',
}: ReelPlayerProps) {
  const active = useCycle(images.length, interval);
  const timecode = useTimecode(37);

  return (
    <div className={`relative overflow-hidden bg-black ${className}`} aria-hidden="true">
      {videoSrc ? (
        <video src={videoSrc} className="absolute inset-0 h-full w-full object-cover" autoPlay muted loop playsInline />
      ) : (
        images.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ${
              i === active ? 'animate-kenburns opacity-100' : 'opacity-0'
            }`}
          />
        ))
      )}

      {letterbox && (
        <>
          <div className="absolute inset-x-0 top-0 h-[7%] bg-black" />
          <div className="absolute inset-x-0 bottom-0 h-[7%] bg-black" />
        </>
      )}

      {chrome && (
        <>
          <span className="absolute right-4 top-[calc(7%+0.75rem)] font-mono text-[10px] tracking-wider text-white/80 tabular-nums sm:right-6">
            {timecode}
          </span>
          {/* Progress bar restarts with every still, like a scrubbing playhead */}
          {!videoSrc && (
            <div className="absolute inset-x-0 bottom-0 h-1 bg-white/15">
              <div
                key={active}
                className="h-full origin-left animate-progress bg-brand"
                style={{ animationDuration: `${interval}ms` }}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
