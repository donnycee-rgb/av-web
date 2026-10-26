import { blanks, type ScriptFieldName } from '@/content/contact';

interface ScriptBlankProps {
  name: ScriptFieldName;
  value: string;
  invalid: boolean;
  onChange: (value: string) => void;
}

// Underline style shared by text and dropdown blanks; typed words show in white italic
const base =
  'mx-1 inline-block border-0 border-b-[3px] bg-transparent px-1 align-baseline font-[inherit] italic leading-[inherit] transition-colors focus:outline-none focus:ring-0';
const stateClass = (invalid: boolean) =>
  invalid ? 'border-dashed border-ink animate-fade-in' : 'border-ink/30 hover:border-ink/60 focus:border-paper';

/** One blank in the contact sentence: a growing text input or an inline dropdown. */
export function ScriptBlank({ name, value, invalid, onChange }: ScriptBlankProps) {
  const blank = blanks[name];
  const common = {
    id: `script-${name}`,
    name,
    'aria-label': blank.label,
    'aria-required': blank.required || undefined,
    'aria-invalid': invalid || undefined,
    'aria-describedby': invalid ? 'script-error' : undefined,
  };

  if (blank.kind === 'select') {
    const shown = value || blank.placeholder;
    return (
      <span className="relative inline-block">
        <select
          {...common}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          // Sized to the chosen wording so the sentence reads naturally
          style={{ width: `${shown.length + 2.2}ch`, maxWidth: 'calc(100% - 0.5rem)' }}
          className={`${base} ${stateClass(invalid)} cursor-pointer appearance-none pr-[1.1em] ${value ? 'text-paper' : 'text-ink/35'}`}
        >
          <option value="" disabled>
            {blank.placeholder}
          </option>
          {blank.options.map((option) => (
            <option key={option} value={option} className="not-italic text-ink">
              {option}
            </option>
          ))}
        </select>
        <span aria-hidden="true" className="pointer-events-none absolute bottom-[0.3em] right-2 text-[0.45em] text-ink/60">
          ▼
        </span>
      </span>
    );
  }

  return (
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
  );
}
