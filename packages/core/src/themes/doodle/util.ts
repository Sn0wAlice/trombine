export type Pt = readonly [number, number];

/** Face center. Every slot positions itself relative to it. */
export const CX = 50;
export const CY = 52;

// Rounding to 2 decimals keeps output short and hides last-bit float noise between engines.
// ponytail: Math.sin/cos are not spec'd bit-exact; every major engine ships fdlibm today,
// swap in a polynomial approximation if a runtime ever disagrees.
const n = (v: number) => String(Math.round(v * 100) / 100);
export const pt = (x: number, y: number) => `${n(x)},${n(y)}`;

export const path = (d: string, attrs = '') => `<path d="${d}"${attrs}/>`;
export const circle = (x: number, y: number, r: number) => `<circle cx="${n(x)}" cy="${n(y)}" r="${n(r)}"/>`;
export const dot = (x: number, y: number, r: number) =>
  `<circle cx="${n(x)}" cy="${n(y)}" r="${n(r)}" fill="#111" stroke="none"/>`;
export const rect = (x: number, y: number, w: number, h: number, rx: number) =>
  `<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" rx="${n(rx)}"/>`;

/** Closed Catmull-Rom spline through `pts`, as cubic beziers. */
export function smoothClosed(pts: readonly Pt[]): string {
  const at = (i: number) => pts[(i + pts.length) % pts.length]!;
  let d = `M ${pt(...at(0))}`;
  for (let i = 0; i < pts.length; i++) {
    const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)];
    const c1 = pt(p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6);
    const c2 = pt(p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6);
    d += ` C ${c1} ${c2} ${pt(...p2)}`;
  }
  return d + ' Z';
}
