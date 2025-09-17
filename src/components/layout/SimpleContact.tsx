'use client';

import React, { useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Reason = 'Hiring' | 'Collab' | 'Other';

export default function SimpleContact() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [reason, setReason] = useState<Reason | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [copy, setCopy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const reasons: Reason[] = useMemo(() => ['Hiring', 'Collab', 'Other'], []);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = 'Please add your name.';
    if (!/.+@.+\..+/.test(email.toLowerCase())) next.email = 'Enter a valid email.';
    if (message.trim().length < 16) next.message = 'Add at least 16 characters.';
    if (!reason) next.reason = 'Pick a reason.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSending(true);
    try {
      const res = await fetch('https://formspree.io/f/xyzdazjg', {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message, reason, copy }),
      });
      setSent(res.ok);
      if (!res.ok) setErrors({ submit: 'Submission failed. Try again.' });
    } catch (e) {
      setErrors({ submit: 'Network error. Try again.' });
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <section id="contact" aria-label="Contact" className="py-24">
        <div className="mx-auto w-full max-w-[1200px] px-[var(--space-24)]">
          <Card>
            <CardContent className="px-6 py-8">
              <div className="text-[20px] font-semibold">Thanks! I reply within 24–48h.</div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" aria-label="Contact" className="py-24">
      <div className="mx-auto w-full max-w-[1200px] px-[var(--space-24)]">
        <Card>
          <CardHeader>
            <CardTitle className="text-[20px] font-semibold">Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-12">
                <div className="flex flex-wrap gap-2">
                  {reasons.map((r) => (
                    <button type="button" key={r} className={`chip ${reason === r ? 'chip--active' : ''}`} onClick={() => setReason(r)}>{r}</button>
                  ))}
                </div>
                {errors.reason && <div className="mt-2 text-[14px] text-red-400">{errors.reason}</div>}
              </div>
              <div className="md:col-span-6">
                <label className="text-[14px]">Name</label>
                <input className="mt-2 w-full rounded-[var(--radius)] border border-[color:rgba(255,255,255,0.08)] bg-[rgb(255_255_255/0.06)] px-3 py-3" value={name} onChange={(e) => setName(e.target.value)} />
                {errors.name && <div className="mt-2 text-[14px] text-red-400">{errors.name}</div>}
              </div>
              <div className="md:col-span-6">
                <label className="text-[14px]">Email</label>
                <input className="mt-2 w-full rounded-[var(--radius)] border border-[color:rgba(255,255,255,0.08)] bg-[rgb(255_255_255/0.06)] px-3 py-3" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                {errors.email && <div className="mt-2 text-[14px] text-red-400">{errors.email}</div>}
              </div>
              <div className="md:col-span-12">
                <label className="text-[14px]">Message</label>
                <textarea rows={4} className="mt-2 w-full rounded-[var(--radius)] border border-[color:rgba(255,255,255,0.08)] bg-[rgb(255_255_255/0.06)] px-3 py-3" value={message} onChange={(e) => setMessage(e.target.value)} />
                {errors.message && <div className="mt-2 text-[14px] text-red-400">{errors.message}</div>}
              </div>
              <div className="md:col-span-12 flex items-center justify-between">
                <label className="inline-flex items-center gap-2 text-[16px] text-[hsl(var(--text-2))]">
                  <input type="checkbox" checked={copy} onChange={(e) => setCopy(e.target.checked)} className="h-5 w-5 rounded border border-[color:rgba(255,255,255,0.08)] bg-[rgb(255_255_255/0.06)]" />
                  Email me a copy
                </label>
                <button type="submit" disabled={sending} className="inline-flex items-center justify-center rounded-[var(--radius)] px-5 py-3 bg-[#49D0C1] text-black font-medium disabled:opacity-60">{sending ? 'Sending…' : 'Send'}</button>
              </div>
              {errors.submit && <div className="md:col-span-12 text-[14px] text-red-400">{errors.submit}</div>}
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}


