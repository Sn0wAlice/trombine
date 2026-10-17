import type { Rng } from '../../rng.js';
import type { Head } from './head.js';
import { path, pt } from './util.js';

const TOP = -Math.PI / 2;

export function hair(rng: Rng, head: Head): string {
  if (!rng.chance(0.6)) return '';
  const kind = rng.weighted([
    ['strands', 50],
    ['spiky', 30],
    ['curl', 20],
  ] as const);

  if (kind === 'strands') {
    let out = '';
    for (let i = rng.int(1, 5); i > 0; i--) {
      const [x, y] = head.edge(TOP + rng.float(-0.6, 0.6));
      const a = TOP + rng.float(-0.7, 0.7);
      const len = rng.float(6, 11);
      const bend = rng.float(-3, 3);
      const [ex, ey] = [x + Math.cos(a) * len, y + Math.sin(a) * len];
      const [mx, my] = [(x + ex) / 2 - Math.sin(a) * bend, (y + ey) / 2 + Math.cos(a) * bend];
      out += path(`M ${pt(x, y)} Q ${pt(mx, my)} ${pt(ex, ey)}`);
    }
    return out;
  }

  if (kind === 'spiky') {
    const spikes = rng.int(4, 7);
    const from = TOP - 0.7;
    let d = '';
    for (let i = 0; i <= spikes * 2; i++) {
      const t = from + (i / (spikes * 2)) * 1.4;
      const out = i % 2 ? rng.float(4, 8) : 0;
      const [x, y] = head.edge(t);
      d += `${i ? ' L' : 'M'} ${pt(x + Math.cos(t) * out, y + Math.sin(t) * out)}`;
    }
    return path(d);
  }

  // curl
  const [x, y] = head.edge(TOP + rng.float(-0.3, 0.3));
  const s = rng.pick([-1, 1]);
  return path(
    `M ${pt(x, y)} C ${pt(x + s, y - 7)} ${pt(x + s * 7, y - 9)} ${pt(x + s * 6, y - 4)}` +
      ` C ${pt(x + s * 5.5, y - 1.5)} ${pt(x + s * 3, y - 2.5)} ${pt(x + s * 3.5, y - 5)}`,
  );
}
