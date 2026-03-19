/**
 * Utility helpers for the portfolio
 */

/** Merge class strings, filtering falsy values */
export function cx(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/** Clamp a value between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Map a value from one range to another */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
}

/** Delay helper */
export const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

/** Format a number with leading zero */
export const pad = (n: number, digits = 2) => String(n).padStart(digits, '0');
