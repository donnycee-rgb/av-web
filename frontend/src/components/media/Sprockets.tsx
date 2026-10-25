interface SprocketsProps {
  className?: string;
}

/** A row of film sprocket holes. Place above and below frames to make a strip of film. */
export function Sprockets({ className = '' }: SprocketsProps) {
  return (
    <div
      aria-hidden="true"
      className={`h-4 w-full sm:h-5 ${className}`}
      style={{
        // Rounded-ish holes: a repeating rectangle pattern, inset from the edges
        backgroundImage:
          'repeating-linear-gradient(90deg, transparent 0 8px, rgba(255,255,255,0.82) 8px 20px, transparent 20px 32px)',
        backgroundSize: '32px 55%',
        backgroundRepeat: 'repeat-x',
        backgroundPosition: '0 50%',
      }}
    />
  );
}
