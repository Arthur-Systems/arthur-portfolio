import tokens from '@/lib/design-tokens.json';

export function getDesignVars() {
  const vars: Record<string, string> = {
    '--bg': tokens.color.background,
    '--card': tokens.color.surface1,
    '--card-2': tokens.color.surface2,
    '--overlay': tokens.color.surface3,
    '--text-1': tokens.color.text1,
    '--text-2': tokens.color.text2,
    '--muted': tokens.color.muted,
    '--accent': tokens.color.accent,
    '--accent-ink': tokens.color.accentInk,
    '--border': tokens.color.border,
    '--ring': tokens.color.ring,
    '--radius': tokens.radius,
    '--radius-lg': tokens.radius,
    '--space-4': tokens.spacing['4'],
    '--space-8': tokens.spacing['8'],
    '--space-12': tokens.spacing['12'],
    '--space-16': tokens.spacing['16'],
    '--space-24': tokens.spacing['24'],
    '--space-32': tokens.spacing['32'],
    '--space-40': tokens.spacing['40'],
    '--space-96': tokens.spacing['96'],
    '--space-128': tokens.spacing['128'],
    '--shadow-card': tokens.shadow.card,
    '--shadow-modal': tokens.shadow.modal,
    '--type-display': tokens.typography.display,
    '--type-h2': tokens.typography.h2,
    '--type-h3': tokens.typography.h3,
    '--type-body': tokens.typography.body,
    '--type-detail': tokens.typography.detail,
  };
  // Prefix hsl-encoded vars for convenience if needed later
  return vars as React.CSSProperties as any;
}
