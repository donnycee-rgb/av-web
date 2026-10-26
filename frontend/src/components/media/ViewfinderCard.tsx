import { useCycle } from '@/hooks/useCycle';
import { useTimecode } from '@/hooks/useTimecode';

interface ViewfinderCardProps {
  /** Stills that cross-fade inside the card */
  images: string[];
  label?: string;
  /** Resting tilt in degrees, e.g. -7 */
  tilt?: number;
  /** Seconds — staggers the image changes between cards */
  delay?: number;
  /** Timecode start, so each card shows a different running clock */
  timecodeStart?: number;
  className?: string;
}

/**
 * A tilted card styled like a camera viewfinder: corner brackets, blinking REC,
 * a running timecode and project stills cycling underneath.
 */
export function ViewfinderCard({
  images,
  label,
  tilt = -6,
  delay = 0,
  timecodeStart = 0,
  className = '',
}: ViewfinderCardProps) {
  const active = useCycle(images.length, 3800, delay * 1000);
  const timecode = useTimecode(timecodeStart);

  return (
    <div className={className} style={{ transform: `rotate(${tilt}deg)` }} aria-hidden="true">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border-[5px] border-white bg-ink shadow-2xl shadow-black/30">
        {images.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            loading="lazy"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
              i === active ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}

        {/* Viewfinder overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" />
        {(['left-2 top-2 border-l-2 border-t-2', 'right-2 top-2 border-r-2 border-t-2', 'bottom-2 left-2 border-b-2 border-l-2', 'bottom-2 right-2 border-b-2 border-r-2'] as const).map(
          (pos) => (
            <span key={pos} className={`absolute h-3.5 w-3.5 border-white/90 ${pos}`} />
          ),
        )}
        <span className="absolute left-5 top-3.5 flex items-center gap-1.5 font-mono text-[9px] font-semibold tracking-wider text-white">
          <span className="h-1.5 w-1.5 animate-rec rounded-full bg-red-500" />
          REC
        </span>
        <span className="absolute bottom-3 right-5 font-mono text-[9px] tracking-wider text-white/90 tabular-nums">
          {timecode}
        </span>
        {label && (
          <span className="absolute bottom-3 left-5 font-mono text-[9px] uppercase tracking-wider text-brand">{label}</span>
        )}
      </div>
    </div>
  );
}
