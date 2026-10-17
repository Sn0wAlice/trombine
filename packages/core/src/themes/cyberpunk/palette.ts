import type { Rng } from '../../rng.js';

const NEONS = ['#00f0ff', '#ff2bd6', '#fcee0a', '#39ff14', '#ff6b00', '#b14dff', '#ff3860'];
const SKIES = [
  ['#0d0221', '#2a1450'],
  ['#0b0c1e', '#1b2244'],
  ['#120012', '#350a3a'],
  ['#001018', '#063040'],
  ['#0c0c0c', '#262626'],
] as const;

export interface Palette {
  neon: string;
  neon2: string;
  sky: readonly [string, string];
  /** Suffix for gradient/filter ids, so several avatars can share one page. */
  id: string;
  /** Attribute that makes an element glow. */
  glow: string;
  /** Fill for a copy of a shape that darkens its right (unlit) side. */
  shade: string;
  /** Wide soft blur, for reflected light. */
  soft: string;
}

export function palette(rng: Rng): Palette {
  const neon = rng.pick(NEONS);
  const neon2 = rng.pick(NEONS.filter((c) => c !== neon));
  const id = Math.floor(rng.next() * 2 ** 32).toString(36);
  return {
    neon,
    neon2,
    sky: rng.pick(SKIES),
    id,
    glow: ` filter="url(#glow-${id})"`,
    shade: ` fill="url(#shade-${id})"`,
    soft: ` filter="url(#soft-${id})"`,
  };
}

/** Shared defs: sky gradient, a small glow and a wide halo blur. */
export function defs(p: Palette): string {
  const blur = (name: string, sd: number) =>
    `<filter id="${name}-${p.id}" filterUnits="userSpaceOnUse" x="0" y="0" width="100" height="100"><feGaussianBlur stdDeviation="${sd}"/></filter>`;
  return (
    `<defs><linearGradient id="sky-${p.id}" x1="0" y1="0" x2="0" y2="1">` +
    `<stop offset="0" stop-color="${p.sky[0]}"/><stop offset="1" stop-color="${p.sky[1]}"/></linearGradient>` +
    `<linearGradient id="neon-${p.id}" x1="0" y1="0" x2="1" y2="0">` +
    `<stop offset="0" stop-color="${p.neon}"/><stop offset="1" stop-color="${p.neon2}"/></linearGradient>` +
    // Light comes from the left: fade to dark across each shape's own box.
    `<linearGradient id="shade-${p.id}" x1="0" y1="0" x2="1" y2="0">` +
    `<stop offset=".4" stop-color="#000" stop-opacity="0"/><stop offset=".85" stop-color="#000" stop-opacity=".5"/></linearGradient>` +
    blur('glow', 1.2) +
    blur('soft', 2.2) +
    blur('halo', 9) +
    '</defs>'
  );
}
