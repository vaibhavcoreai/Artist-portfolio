/**
 * Design System Tokens — Deepak Patil Fine Art Portfolio
 * Dark luxury editorial aesthetic: velvet darkness, gold leaf accents, dramatic negative space
 */

// ─── Color Palette ────────────────────────────────────────────────────────────
export const colors = {
  nearBlack:    '#080608',
  deepCharcoal: '#111014',
  warmIvory:    '#F2EDE4',
  agedGold:     '#B8956A',
  mutedBronze:  '#7A5C3A',
  ghostWhite:   '#FAF8F5',

  // Derived / utility
  goldTransparent: 'rgba(184, 149, 106, 0.15)',
  ivoryTransparent: 'rgba(242, 237, 228, 0.06)',
  overlayDark: 'rgba(8, 6, 8, 0.72)',
} as const;

// ─── Typography ───────────────────────────────────────────────────────────────
export const typography = {
  fontSerif: '"Cormorant Garamond", Georgia, serif',
  fontSans:  '"Jost", system-ui, sans-serif',

  scale: {
    display:  { size: '96px',  weight: 400, style: 'italic',  lineHeight: 1.0, letterSpacing: '-0.02em' },
    headline: { size: '48px',  weight: 300, style: 'normal',  lineHeight: 1.1, letterSpacing: '-0.01em' },
    title:    { size: '32px',  weight: 300, style: 'normal',  lineHeight: 1.2, letterSpacing: '0em'     },
    body:     { size: '16px',  weight: 300, style: 'normal',  lineHeight: 1.7, letterSpacing: '0em'     },
    caption:  { size: '12px',  weight: 400, style: 'normal',  lineHeight: 1.5, letterSpacing: '0.1em'   },
    nav:      { size: '13px',  weight: 200, style: 'normal',  lineHeight: 1.0, letterSpacing: '0.12em'  },
  },
} as const;

// ─── Spacing Scale (8px base unit) ────────────────────────────────────────────
export const spacing = {
  xs:   '8px',
  sm:   '16px',
  md:   '24px',
  lg:   '32px',
  xl:   '40px',
  '2xl': '48px',
  '3xl': '64px',
  '4xl': '80px',
  '5xl': '96px',
  '6xl': '128px',
} as const;

// ─── Breakpoints ──────────────────────────────────────────────────────────────
export const breakpoints = {
  sm:  '640px',
  md:  '768px',
  lg:  '1024px',
  xl:  '1280px',
  '2xl': '1536px',
} as const;

// ─── Motion / Easing ──────────────────────────────────────────────────────────
export const motion = {
  ease: {
    luxury:   [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    entrance: [0.0,  0.0,  0.2,  1.0]  as [number, number, number, number],
    exit:     [0.4,  0.0,  1.0,  1.0]  as [number, number, number, number],
  },
  duration: {
    fast:   0.2,
    normal: 0.5,
    slow:   0.8,
    epic:   1.4,
  },
} as const;

// ─── Z-index layers ───────────────────────────────────────────────────────────
export const zIndex = {
  base:    0,
  raised:  10,
  overlay: 20,
  nav:     30,
  cursor:  9999,
} as const;
