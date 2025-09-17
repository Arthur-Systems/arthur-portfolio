'use client';

import React from 'react';

type SectionProps = React.PropsWithChildren<{
  id?: string;
  className?: string;
  ariaLabel?: string;
}>;

export default function Section({ id, className = '', ariaLabel, children }: SectionProps) {
  return (
    <section id={id} aria-label={ariaLabel} className={`py-24 ${className}`}>
      <div className="mx-auto w-full max-w-[1200px] px-[var(--space-24)]">
        {children}
      </div>
    </section>
  );
}


