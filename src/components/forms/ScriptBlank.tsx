import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react';
import { blanks, contact, type ScriptFieldName } from '@/content/contact';
import { PencilCircle } from '@/components/ui/GreasePencil';

interface ScriptBlankProps {
  name: ScriptFieldName;
  value: string;
  invalid: boolean;
  onChange: (value: string) => void;
}

// Underline style shared by text and pick blanks; typed words show in white italic
const base =
  'mx-1 inline-block border-0 border-b-[3px] bg-transparent px-1 align-baseline font-[inherit] italic leading-[inherit] transition-colors focus:outline-none focus:ring-0';
const stateClass = (invalid: boolean) =>
  invalid ? 'border-dashed border-ink' : 'border-ink/30 hover:border-ink/60 focus:border-paper';
// Where the "fix this" circle sits around a blank
const MISSING_CIRCLE = '-left-[6%] -right-[6%] -top-[16%] -bottom-[10%] text-ink';
/** How long the chosen option's circle shows before the contact sheet tucks away */
const CLOSE_AFTER = 650;

/**
 * One blank in the contact sentence: a growing text input, or a pick from a short list.
 * A missing answer gets circled in grease pencil, rubbed out again once it's filled in.
 */
export function ScriptBlank({ name, value, invalid, onChange }: ScriptBlankProps) {
  const blank = blanks[name];
  const variant = Object.keys(blanks).indexOf(name);
  const common = {
    id: `script-${name}`,
    name,
    'aria-label': blank.label,
    'aria-required': blank.required || undefined,
    'aria-invalid': invalid || undefined,
    'aria-describedby': invalid ? 'script-error' : undefined,
  };

  if (blank.kind === 'select') {
    return (
      <span className="relative inline-block">
        <ScriptPick common={common} options={blank.options} placeholder={blank.placeholder} value={value} invalid={invalid} onChange={onChange} />
        <PencilCircle drawn={invalid} variant={variant} className={MISSING_CIRCLE} />
      </span>
    );
  }

  return (
    <span className="relative inline-block max-w-full">
      <input
        {...common}
        type={blank.kind === 'email' ? 'email' : 'text'}
        inputMode={blank.kind === 'email' ? 'email' : undefined}
        autoComplete={name === 'name' ? 'name' : name === 'email' ? 'email' : 'off'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={blank.placeholder}
        // Grows with what's typed, never narrower than the placeholder; capped to the line width
        style={{ width: `${Math.max(value.length, blank.placeholder.length) + 1}ch`, maxWidth: 'calc(100% - 0.5rem)' }}
        className={`${base} ${stateClass(invalid)} text-paper placeholder:text-ink/35`}
      />
      <PencilCircle drawn={invalid} variant={variant} className={MISSING_CIRCLE} />
    </span>
  );
}

interface ScriptPickProps {
  common: Record<string, string | boolean | undefined>;
  options: string[];
  placeholder: string;
  value: string;
  invalid: boolean;
  onChange: (value: string) => void;
}

/**
 * A pick-one blank. It opens a little contact sheet of options; choosing one circles it in orange
 * grease pencil, drops the words into the sentence, and the sheet tucks away.
 * Keyboard: arrows move, Enter/Space choose, Escape closes.
 */
function ScriptPick({ common, options, placeholder, value, invalid, onChange }: ScriptPickProps) {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [shift, setShift] = useState(0);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLSpanElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const timers = useRef<number[]>([]);
  const listId = `${common.id}-sheet`;

  const clearTimers = () => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
  };
  useEffect(() => clearTimers, []);

  const close = (refocus: boolean) => {
    clearTimers();
    setClosing(true);
    timers.current.push(
      window.setTimeout(() => {
        setOpen(false);
        setClosing(false);
        if (refocus) triggerRef.current?.focus();
      }, 200),
    );
  };

  const choose = (option: string) => {
    onChange(option);
    clearTimers();
    // Let the circle draw before the sheet goes
    timers.current.push(window.setTimeout(() => close(true), CLOSE_AFTER));
  };

  // Keep the sheet on screen: nudge it left if it would run off the right edge
  useLayoutEffect(() => {
    if (!open) return setShift(0);
    const rect = sheetRef.current?.getBoundingClientRect();
    if (rect) setShift(Math.min(0, window.innerWidth - 16 - rect.right));
    // Start keyboard users on the chosen option (or the first)
    optionRefs.current[Math.max(0, options.indexOf(value))]?.focus({ preventScroll: true });
  }, [open]);

  // A click anywhere else closes it
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (!sheetRef.current?.contains(target) && !triggerRef.current?.contains(target)) close(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open]);

  const onSheetKey = (e: KeyboardEvent) => {
    const at = optionRefs.current.findIndex((el) => el === document.activeElement);
    const move = (to: number) => {
      e.preventDefault();
      optionRefs.current[(to + options.length) % options.length]?.focus();
    };
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') move(at + 1);
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') move(at - 1);
    else if (e.key === 'Home') move(0);
    else if (e.key === 'End') move(options.length - 1);
    else if (e.key === 'Escape') {
      e.preventDefault();
      close(true);
    } else if (e.key === 'Tab') close(false);
  };

  const shown = value || placeholder;

  return (
    <>
      <button
        {...common}
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        onClick={() => (open ? close(false) : setOpen(true))}
        className={`${base} ${stateClass(invalid)} cursor-pointer whitespace-nowrap text-left ${value ? 'text-paper' : 'text-ink/35'} ${open ? 'border-paper' : ''}`}
      >
        {shown}
        <span aria-hidden="true" className={`ml-2 inline-block text-[0.45em] align-middle text-ink/60 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {open && (
        // Spans throughout: the sheet sits inside the sentence's paragraph
        <span
          ref={sheetRef}
          className={`absolute left-0 block top-full z-30 mt-3 w-[min(24rem,calc(100vw-2rem))] origin-top-left transition-[opacity,transform] duration-200 ease-out ${
            closing ? 'scale-95 opacity-0' : 'animate-fade-in'
          }`}
          style={{ translate: `${shift}px 0` }}
        >
          {/* The contact sheet: paper, slightly askew, with numbered frames */}
          <span className="block -rotate-1 rounded-sm bg-paper p-4 font-sans not-italic leading-normal text-ink shadow-[0_18px_40px_-12px_rgba(40,20,0,0.5)]">
            <span className="mb-3 flex justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-ink/50">
              <span>{contact.pick.sheet}</span>
              <span>{contact.pick.hint}</span>
            </span>
            <span id={listId} role="listbox" aria-label={String(common['aria-label'])} onKeyDown={onSheetKey} className="grid grid-cols-2 gap-1.5">
              {options.map((option, i) => {
                const chosen = option === value;
                return (
                  <button
                    key={option}
                    ref={(el) => {
                      optionRefs.current[i] = el;
                    }}
                    type="button"
                    role="option"
                    aria-selected={chosen}
                    tabIndex={chosen || (!value && i === 0) ? 0 : -1}
                    onClick={() => (chosen ? close(true) : choose(option))}
                    className="group relative flex items-baseline gap-2 rounded-sm border border-ink/10 bg-white/40 px-3 py-2.5 text-left outline-none transition-colors hover:bg-white focus-visible:border-ink/40 focus-visible:bg-white"
                  >
                    <span className="font-mono text-[10px] text-ink/40">{String(i + 1).padStart(2, '0')}</span>
                    <span className="font-display text-lg leading-tight">{option}</span>
                    <PencilCircle drawn={chosen} variant={i} className="-inset-x-1.5 -inset-y-1 text-brand-dark" />
                  </button>
                );
              })}
            </span>
          </span>
        </span>
      )}
    </>
  );
}
