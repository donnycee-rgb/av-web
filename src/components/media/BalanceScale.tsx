import { useEffect, useRef } from 'react';
// Our assembled drawing (scale + camera + microphone) — see src/assets/illustrations/README.md for credits
import scaleMarkup from '@/assets/illustrations/balance-scale.svg?raw';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface BalanceScaleProps {
  className?: string;
}

/** Where the beam turns, and where each pan hangs from it (drawing units) */
const PIVOT = { x: 425, y: 205 };
const HOOKS = { left: { x: 189.2, y: 262 }, right: { x: 661.2, y: 262 } };

// The beam is a damped spring: STIFFNESS pulls it towards balance, DAMPING lets it swing a few times first
const STIFFNESS = 26;
const DAMPING = 2.6;
/** How far (degrees) one load tips the beam on its own */
const TIP = 9;
/** Kick (degrees per second) when a load lands in its pan */
const LANDING_KICK = 28;
/** Loads drop in at these times (s) and fall for FALL_TIME from FALL_HEIGHT above their pan */
const DROPS = { left: 0.7, right: 2.1 };
const FALL_TIME = 0.5;
const FALL_HEIGHT = 260;
/** After this long the scale only breathes, and leans a little towards the mouse */
const IDLE_AFTER = 6;

/**
 * "Image and sound, treated as equals": a balance scale. A camera drops into one pan and tips it,
 * then a microphone drops into the other and the beam swings back and settles level. After that it
 * barely breathes, and leans slightly towards the side the mouse is over. With reduced motion it
 * stays still, level, with both loads in place (which is how the drawing is saved).
 */
export function BalanceScale({ className = '' }: BalanceScaleProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const host = ref.current;
    const svg = host?.querySelector('svg');
    if (!host || !svg || reduced) return;
    const part = (id: string) => svg.querySelector<SVGGElement>(`#${id}`);
    const beam = part('beam');
    const pans = { left: part('pan-left'), right: part('pan-right') };
    const loads = { left: part('load-left'), right: part('load-right') };

    const state = { tilt: 0, velocity: 0, bias: 0, time: 0 };
    const landed = { left: false, right: false };
    let visible = false;
    let frame = 0;
    let last = 0;

    // Draw the scale at the current tilt: the beam turns, the pans follow its ends but hang straight down
    const draw = () => {
      const a = (state.tilt * Math.PI) / 180;
      const cos = Math.cos(a);
      const sin = Math.sin(a);
      beam?.setAttribute('transform', `rotate(${state.tilt.toFixed(3)} ${PIVOT.x} ${PIVOT.y})`);
      (['left', 'right'] as const).forEach((side) => {
        const dx = HOOKS[side].x - PIVOT.x;
        const dy = HOOKS[side].y - PIVOT.y;
        const tx = dx * cos - dy * sin - dx;
        const ty = dx * sin + dy * cos - dy;
        pans[side]?.setAttribute('transform', `translate(${tx.toFixed(2)} ${ty.toFixed(2)})`);

        // A load still in the air: falls with gravity, fading in as it comes
        const t = (state.time - DROPS[side]) / FALL_TIME;
        const fall = t >= 1 ? 0 : FALL_HEIGHT * (1 - Math.max(0, t) ** 2);
        loads[side]?.setAttribute('transform', `translate(0 ${(-fall).toFixed(1)})`);
        loads[side]?.setAttribute('opacity', t <= 0 ? '0' : Math.min(1, t * 2.5).toFixed(2));
        if (t >= 1 && !landed[side]) {
          landed[side] = true;
          state.velocity += side === 'left' ? -LANDING_KICK : LANDING_KICK;
        }
      });
    };

    const tick = (now: number) => {
      // Clamp the step so a stalled tab doesn't make the beam jump
      const dt = Math.min(0.033, (now - last) / 1000 || 0);
      last = now;
      state.time += dt;

      // Balance point: each landed load pulls its side down; idle adds breath and the mouse's lean
      let target = TIP * (Number(landed.right) - Number(landed.left));
      if (state.time > IDLE_AFTER) target += 0.5 * Math.sin((state.time * 2 * Math.PI) / 5) + state.bias;
      state.velocity += (-STIFFNESS * (state.tilt - target) - DAMPING * state.velocity) * dt;
      state.tilt += state.velocity * dt;

      draw();
      frame = visible ? requestAnimationFrame(tick) : 0;
    };

    const run = () => {
      if (frame) return;
      last = performance.now();
      frame = requestAnimationFrame(tick);
    };

    // Starts the first time it's on screen; pauses whenever it's off screen
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) run();
    });
    observer.observe(host);
    draw(); // Empty pans until it starts

    // The mouse leans the beam a little towards its side (only once the loads have settled)
    const onMove = (e: MouseEvent) => {
      const rect = host.getBoundingClientRect();
      state.bias = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
    };
    const onLeave = () => {
      state.bias = 0;
    };
    host.addEventListener('mousemove', onMove);
    host.addEventListener('mouseleave', onLeave);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      host.removeEventListener('mousemove', onMove);
      host.removeEventListener('mouseleave', onLeave);
    };
  }, [reduced]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`[&>svg]:h-full [&>svg]:w-full ${className}`}
      // Matches the drawing's viewBox (850 × 822)
      style={{ aspectRatio: '850 / 822' }}
      dangerouslySetInnerHTML={{ __html: scaleMarkup }}
    />
  );
}
