import { useRef, useState, type FormEvent } from 'react';
import { blanks, contact, script, type ScriptFieldName } from '@/content/contact';
import { site } from '@/content/site';
import { submitNetlifyForm } from '@/lib/netlifyForm';
import { Container } from '@/components/ui/Container';
import { ScriptBlank } from '@/components/forms/ScriptBlank';
import { Clapperboard } from '@/components/media/Clapperboard';
import { DirectorMark } from '@/components/ui/DirectorMark';

const FORM_NAME = 'contact-script';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FIELDS = Object.keys(blanks) as ScriptFieldName[];
const EMPTY = Object.fromEntries(FIELDS.map((f) => [f, ''])) as Record<ScriptFieldName, string>;

const digits = (phone: string) => phone.replace(/\D/g, '');
// "a music video" → "Music video" for the slate
const slateText = (value: string) => {
  const trimmed = value.replace(/^(a|an)\s+/i, '');
  return trimmed ? trimmed[0].toUpperCase() + trimmed.slice(1) : '';
};

/**
 * Contact as a fill-in-the-script sentence on a full orange screen. A clapperboard beside it
 * chalks in the answers live and snaps shut when the message is sent (via Netlify Forms).
 */
export function ContactScene() {
  const [values, setValues] = useState(EMPTY);
  const [invalid, setInvalid] = useState<ScriptFieldName[]>([]);
  const [error, setError] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [delivered, setDelivered] = useState(true);
  const formRef = useRef<HTMLFormElement>(null);

  const update = (field: ScriptFieldName) => (value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
    if (invalid.includes(field)) {
      const remaining = invalid.filter((f) => f !== field);
      setInvalid(remaining);
      // Once every highlighted blank has been touched, the message has done its job
      if (remaining.length === 0) setError('');
    }
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const missing = FIELDS.filter((f) => blanks[f].required && !values[f].trim());
    const badEmail = values.email.trim() !== '' && !EMAIL_PATTERN.test(values.email.trim());
    const problems = badEmail ? [...missing, 'email' as const] : missing;

    if (problems.length) {
      setInvalid(problems);
      setError(missing.length ? contact.missing : contact.invalidEmail);
      formRef.current?.querySelector<HTMLElement>(`[name="${problems[0]}"]`)?.focus();
      return;
    }

    setError('');
    setStatus('sending');
    try {
      const honeypot = formRef.current?.querySelector<HTMLInputElement>('[name="bot-field"]')?.value ?? '';
      const { sent } = await submitNetlifyForm(FORM_NAME, { ...values, 'bot-field': honeypot });
      setDelivered(sent);
      setStatus('sent');
    } catch {
      setStatus('idle');
      setError(contact.failed);
    }
  };

  const reset = () => {
    setValues(EMPTY);
    setInvalid([]);
    setStatus('idle');
  };

  const sent = status === 'sent';

  return (
    <section className="relative min-h-svh overflow-hidden bg-brand pb-16 pt-28 text-ink sm:pt-32">
      <Container className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Sentence / success */}
        {/* min-w-0 lets this grid column shrink to the screen; otherwise wide blanks stretch it past the edge */}
        <div className="min-w-0 lg:col-span-8">
          <p className="mb-8 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-[0.25em]">
            <span>{contact.eyebrow}</span>
            <span aria-hidden="true" className="h-px w-8 bg-ink/40" />
            <span className="text-ink/60">{contact.replyNote}</span>
          </p>

          {sent ? (
            <div role="status" className="animate-fade-in">
              <p className="font-display text-4xl italic text-paper sm:text-5xl">{contact.success.kicker}</p>
              <h1 className="mt-2 text-7xl leading-none sm:text-9xl">
                <DirectorMark type="circle" colorClass="text-paper" delay={450}>
                  {contact.success.title}
                </DirectorMark>
              </h1>
              <p className="mt-8 max-w-lg text-lg">{contact.success.body(values.name.trim())}</p>
              {!delivered && <p className="mt-4 max-w-lg text-sm text-ink/60">{contact.success.devNote}</p>}
              <button type="button" onClick={reset} className="mt-8 font-semibold underline underline-offset-4 hover:text-paper">
                {contact.success.again}
              </button>
            </div>
          ) : (
            <form ref={formRef} name={FORM_NAME} onSubmit={onSubmit} noValidate>
              {/* Honeypot: hidden from people, tempting to bots */}
              <p className="hidden">
                <label>
                  Don’t fill this in: <input name="bot-field" tabIndex={-1} autoComplete="off" />
                </label>
              </p>

              <h1 className="sr-only">Contact AV Productions</h1>
              <p className="font-display text-[clamp(1.85rem,4.2vw,4rem)] leading-[1.35]">
                {script.map((part, i) =>
                  'text' in part ? (
                    <span key={i}>{part.text}</span>
                  ) : (
                    <ScriptBlank
                      key={part.field}
                      name={part.field}
                      value={values[part.field]}
                      invalid={invalid.includes(part.field)}
                      onChange={update(part.field)}
                    />
                  ),
                )}
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="group inline-flex items-center gap-3 rounded-full bg-ink px-8 py-4 text-base font-semibold text-paper transition-colors hover:bg-navy disabled:opacity-60"
                >
                  <span className="h-2.5 w-2.5 rounded-full bg-brand group-hover:animate-rec" aria-hidden="true" />
                  {status === 'sending' ? contact.sending : contact.send}
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </button>
                {error && (
                  <p id="script-error" role="alert" className="max-w-md font-medium">
                    {error}
                  </p>
                )}
              </div>
            </form>
          )}
        </div>

        {/* Clapperboard */}
        <div className="mx-auto w-full max-w-[18rem] sm:max-w-[22rem] lg:col-span-4 lg:max-w-none">
          <Clapperboard
            prod={slateText(values.type)}
            scene={values.location.trim()}
            date={values.date.trim()}
            director={values.name.trim()}
            closed={sent}
            className="rotate-[3deg]"
          />
        </div>
      </Container>

      {/* Direct lines */}
      <Container className="mt-16 sm:mt-20">
        <ul className="grid gap-6 border-t border-ink/20 pt-8 sm:grid-cols-3">
          {[
            { label: contact.direct.email, value: site.email, href: `mailto:${site.email}` },
            { label: contact.direct.whatsapp, value: `${site.phone} ↗`, href: `https://wa.me/${digits(site.phone)}`, external: true },
            { label: contact.direct.phone, value: site.phone, href: `tel:+${digits(site.phone)}` },
          ].map((item) => (
            <li key={item.label}>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/60">{item.label}</p>
              <a
                href={item.href}
                {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="mt-1 block break-words font-display text-2xl transition-colors hover:text-paper"
              >
                {item.value}
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
