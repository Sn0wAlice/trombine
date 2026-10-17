import type { Rng } from '../../rng.js';
import type { Palette } from './palette.js';
import { circle, path, pt, rect } from '../util.js';

/** Sky, neon halo behind the head, city skyline with lit windows. */
export function scene(rng: Rng, p: Palette, background: string | undefined): string {
  let out = `<rect width="100" height="100" fill="${background ?? `url(#sky-${p.id})`}"/>`;
  out += circle(50, 44, rng.float(22, 28), ` fill="${p.neon}" fill-opacity=".35" filter="url(#halo-${p.id})"`);

  // Lit windows go into one path per color: hundreds of <rect>s would triple the SVG size.
  const lit = ['', ''];
  for (let x = 0; x < 100; ) {
    const w = Math.min(rng.float(6, 13), 100 - x);
    const h = rng.float(16, 42);
    out += rect(x, 100 - h, w, h, 0, ' fill="#000" fill-opacity=".45"');
    for (let wy = 100 - h + 2; wy < 96; wy += 3) {
      for (let wx = x + 1.5; wx < x + w - 1.5; wx += 2.5) {
        if (rng.chance(0.18)) lit[rng.chance(0.7) ? 0 : 1] += `M ${pt(wx, wy)} L ${pt(wx + 1, wy)} L ${pt(wx + 1, wy + 1.4)} L ${pt(wx, wy + 1.4)} Z`;
      }
    }
    x += w;
  }
  return out + [p.neon2, p.neon].map((c, i) => (lit[i] ? path(lit[i], ` fill="${c}" fill-opacity=".7"`) : '')).join('');
}

/** CRT scanlines over everything. */
export function scanlines(rng: Rng): string {
  if (!rng.chance(0.6)) return '';
  let d = '';
  for (let y = 1; y < 100; y += 2) d += `M ${pt(0, y)} L ${pt(100, y)} `;
  return path(d.trim(), ' stroke="#000" stroke-opacity=".14" stroke-width=".5"');
}

/** A few displaced neon slices. */
export function glitch(rng: Rng, p: Palette): string {
  if (!rng.chance(0.15)) return '';
  let out = '';
  for (let i = rng.int(2, 4); i > 0; i--) {
    const x = rng.float(5, 60);
    out += rect(x, rng.float(15, 85), rng.float(10, 95 - x), rng.float(0.6, 2), 0, ` fill="${rng.chance(0.5) ? p.neon : p.neon2}" fill-opacity=".55"`);
  }
  return out;
}
