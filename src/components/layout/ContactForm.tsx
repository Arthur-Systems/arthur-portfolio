'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';

type Reason = 'General' | 'Project' | 'Speaking' | 'Hiring' | 'Other';
type Budget = '<$1k' | '$1–5k' | '$5–15k' | '$15–50k' | '$50k+';
type Timeline = 'ASAP' | '2–4 weeks' | '1–3 months' | '3+ months';
type ContactPref = 'Email' | 'Calendar link' | 'Telegram';

export default function ContactForm() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const [reason, setReason] = useState<Reason | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [budget, setBudget] = useState<Budget | null>(null);
  const [timeline, setTimeline] = useState<Timeline | null>(null);
  const [pref, setPref] = useState<ContactPref>('Email');
  const [consent, setConsent] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const showProjectBlock = reason === 'Project' || reason === 'Hiring';

  useEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(rootRef.current!, { opacity: 0, y: 12, duration: 0.32, ease: 'power2.out' });
      const children = rootRef.current!.querySelectorAll('[data-stagger]');
      gsap.from(children, { opacity: 0, y: 8, duration: 0.28, ease: 'power2.out', stagger: 0.08, delay: 0.05 });
    });
    return () => ctx.revert();
  }, []);

  const reasons: Reason[] = useMemo(() => ['General', 'Project', 'Speaking', 'Hiring', 'Other'], []);
  const budgets: Budget[] = useMemo(() => ['<$1k', '$1–5k', '$5–15k', '$15–50k', '$50k+'], []);
  const timelines: Timeline[] = useMemo(() => ['ASAP', '2–4 weeks', '1–3 months', '3+ months'], []);
  const prefs: ContactPref[] = useMemo(() => ['Email', 'Calendar link', 'Telegram'], []);

  const validate = () => {
    const next: Record<string, string> = {};
    const emailOk = /.+@.+\..+/.test(email.toLowerCase());
    if (!reason) next.reason = 'Please fill this in.';
    if (!name.trim()) next.name = 'Please fill this in.';
    if (!emailOk) next.email = "That doesn’t look like an email.";
    if (message.trim().length < 20) next.message = 'Add a bit more detail (20+ characters).';
    if (showProjectBlock) {
      if (!budget) next.budget = 'Please fill this in.';
      if (!timeline) next.timeline = 'Please fill this in.';
    }
    if (file) {
      const okType = /(pdf|png|jpe?g|mp4)$/i.test(file.name);
      const okSize = file.size <= 10 * 1024 * 1024;
      if (!okType || !okSize) next.file = 'Max 10MB, PDF/PNG/JPG/MP4 only.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) {
      try {
        const first = rootRef.current?.querySelector('[data-error]');
        first && first.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } catch {}
      return;
    }
    setSending(true);
    try {
      const formEl = e.currentTarget;
      const formData = new FormData(formEl);
      const res = await fetch('https://formspree.io/f/xyzdazjg', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
      });
      if (res.ok) {
        setSent(true);
      } else {
        // Try to surface Formspree errors if present
        try {
          const data = await res.json();
          console.warn('Formspree error', data);
        } catch {}
        setErrors((prev) => ({ ...prev, submit: 'Submission failed. Please try again.' }));
      }
    } catch (err) {
      setErrors((prev) => ({ ...prev, submit: 'Network error. Please try again.' }));
    } finally {
      setSending(false);
    }
  };

  const Chip = ({ label, selected, onClick }: { label: string; selected?: boolean; onClick: () => void }) => (
    <button type="button" className={`chip ${selected ? 'chip--active' : ''}`} onClick={onClick} data-interactive>
      {label}
    </button>
  );

  if (sent) {
    return (
      <div ref={rootRef} className="mt-[var(--space-32)]">
        <div className="mx-auto w-full max-w-[1200px]">
          <div className="rounded-[var(--radius-lg)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-[var(--space-24)]">
            <h2 className="section-title">Thanks! I got your message.</h2>
            <p className="mt-[var(--space-8)] text-[15px] leading-6 text-[hsl(var(--text-2))]">
              I’ll reply to <strong>{email}</strong> soon. If you don’t hear back within 48 hours, email me at
              <a className="ml-1 text-[hsl(var(--accent))] hover:underline" href="mailto:arthur.wei50@gmail.com">arthur.wei50@gmail.com</a>.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={rootRef} className="mt-[var(--space-40)]">
      <div className="mx-auto w-full max-w-[1200px]">
        <section aria-label="Contact" className="rounded-[var(--radius-lg)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-[var(--space-24)]">
          <header className="mb-[var(--space-16)]" data-stagger>
            <div className="eyebrow">Contact</div>
            <h2 className="section-title">Contact Arthur</h2>
            <p className="mt-[var(--space-8)] text-[15px] leading-6 text-[hsl(var(--text-2))]">I read every message. Replies within 24–48 hours.</p>
          </header>

          <form
            action="https://formspree.io/f/xyzdazjg"
            method="POST"
            encType="multipart/form-data"
            onSubmit={onSubmit}
            ref={formRef}
            noValidate
            className="grid grid-cols-1 md:grid-cols-12 gap-[24px]"
            aria-live="polite"
          >
            {/* Hidden meta + honeypot */}
            <input type="hidden" name="_subject" value="New contact form submission" />
            <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
            <input type="hidden" name="reason" value={reason ?? ''} />
            <input type="hidden" name="budget" value={showProjectBlock && budget ? budget : ''} />
            <input type="hidden" name="timeline" value={showProjectBlock && timeline ? timeline : ''} />
            <input type="hidden" name="preferred_contact" value={pref} />
            <input type="hidden" name="consent" value={consent ? 'yes' : 'no'} />
            {/* Reason */}
            <div className="md:col-span-12" data-stagger>
              <div className="eyebrow mb-[var(--space-8)]">Reason</div>
              <div className="flex flex-wrap gap-[8px]">
                {reasons.map((r) => (
                  <Chip key={r} label={r} selected={reason === r} onClick={() => setReason(r)} />
                ))}
              </div>
              {errors.reason && <div data-error className="mt-[var(--space-8)] text-[13px] leading-[18px] text-red-400">{errors.reason}</div>}
            </div>

            {/* Name */}
            <div className="md:col-span-6" data-stagger>
              <label className="eyebrow">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={validate}
                className="mt-[var(--space-8)] w-full rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--card-2))] px-[var(--space-12)] py-[var(--space-12)] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                type="text"
                name="name"
                aria-invalid={!!errors.name}
              />
              {errors.name && <div data-error className="mt-[var(--space-8)] text-[13px] leading-[18px] text-red-400">{errors.name}</div>}
            </div>

            {/* Email */}
            <div className="md:col-span-6" data-stagger>
              <label className="eyebrow">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={validate}
                className="mt-[var(--space-8)] w-full rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--card-2))] px-[var(--space-12)] py-[var(--space-12)] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                type="email"
                name="email"
                aria-invalid={!!errors.email}
              />
              {errors.email && <div data-error className="mt-[var(--space-8)] text-[13px] leading-[18px] text-red-400">{errors.email}</div>}
            </div>

            {/* Message */}
            <div className="md:col-span-12" data-stagger>
              <label className="eyebrow">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onBlur={validate}
                rows={3}
                className="mt-[var(--space-8)] w-full rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--card-2))] px-[var(--space-12)] py-[var(--space-12)] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                name="message"
                aria-invalid={!!errors.message}
              />
              <div className="mt-[var(--space-8)] text-[13px] leading-[18px] text-[hsl(var(--muted))] text-right">{message.length}/1200</div>
              {errors.message && <div data-error className="mt-[var(--space-8)] text-[13px] leading-[18px] text-red-400">{errors.message}</div>}
            </div>

            {/* Conditional block */}
            {showProjectBlock && (
              <div className="md:col-span-12" data-stagger>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px]">
                  <div>
                    <div className="eyebrow mb-[var(--space-8)]">Budget</div>
                    <div className="flex flex-wrap gap-[8px]">
                      {budgets.map((b) => (
                        <Chip key={b} label={b} selected={budget === b} onClick={() => setBudget(b)} />
                      ))}
                    </div>
                    {errors.budget && <div data-error className="mt-[var(--space-8)] text-[13px] leading-[18px] text-red-400">{errors.budget}</div>}
                  </div>
                  <div>
                    <div className="eyebrow mb-[var(--space-8)]">Timeline</div>
                    <div className="flex flex-wrap gap-[8px]">
                      {timelines.map((t) => (
                        <Chip key={t} label={t} selected={timeline === t} onClick={() => setTimeline(t)} />
                      ))}
                    </div>
                    {errors.timeline && <div data-error className="mt-[var(--space-8)] text-[13px] leading-[18px] text-red-400">{errors.timeline}</div>}
                  </div>
                  <div>
                    <div className="eyebrow mb-[var(--space-8)]">Attachment</div>
                    <input
                      type="file"
                      onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                      className="block w-full text-[13px] file:mr-[var(--space-12)] file:py-[var(--space-8)] file:px-[var(--space-12)] file:rounded-[var(--radius)] file:border file:border-[hsl(var(--border))] file:bg-[hsl(var(--card))] file:text-[hsl(var(--text-1))]"
                      accept=".pdf,.png,.jpg,.jpeg,.mp4"
                      name="attachment"
                      aria-describedby={errors.file ? 'file-error' : undefined}
                    />
                    {errors.file && <div id="file-error" data-error className="mt-[var(--space-8)] text-[13px] leading-[18px] text-red-400">{errors.file}</div>}
                  </div>
                </div>
              </div>
            )}

            {/* Preferred contact */}
            <div className="md:col-span-8" data-stagger>
              <div className="eyebrow mb-[var(--space-8)]">Preferred contact</div>
              <div className="flex flex-wrap gap-[8px]">
                {prefs.map((p) => (
                  <Chip key={p} label={p} selected={pref === p} onClick={() => setPref(p)} />
                ))}
              </div>
            </div>

            {/* Consent */}
            <div className="md:col-span-4 flex items-end" data-stagger>
              <label className="inline-flex items-center gap-[8px] text-[15px] leading-6 text-[hsl(var(--text-2))]">
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="h-5 w-5 rounded border border-[hsl(var(--border))] bg-[hsl(var(--card-2))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]" />
                You can email me back.
              </label>
            </div>

            {/* Footer */}
            <div className="md:col-span-12 flex items-center justify-between gap-[16px]" data-stagger>
              <a href="mailto:arthur.wei50@gmail.com" className="text-[hsl(var(--accent))] hover:underline">Email me directly</a>
              <button
                type="submit"
                disabled={sending}
                className="inline-flex items-center justify-center rounded-[var(--radius)] px-[var(--space-16)] py-[var(--space-12)] bg-[hsl(var(--accent))] text-[hsl(var(--accent-ink))] font-medium disabled:opacity-60"
                data-interactive
              >
                {sending ? 'Sending…' : 'Send message'}
              </button>
            </div>
            {errors.submit && (
              <div className="md:col-span-12 text-[13px] leading-[18px] text-red-400" role="alert">{errors.submit}</div>
            )}
          </form>
        </section>
      </div>
    </div>
  );
}


