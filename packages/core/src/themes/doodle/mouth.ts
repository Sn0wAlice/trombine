import type { Rng } from '../../rng.js';
import type { Eyes } from './eyes.js';
import type { Head } from './head.js';
import { CX, circle, path, pt } from './util.js';

export function mouth(rng: Rng, head: Head, eyes: Eyes): string {
  const kind = rng.weighted([
    ['line', 60],
    ['open', 18],
    ['o', 14],
    ['wavy', 8],
  ] as const);
  const x = CX + rng.float(-1.5, 1.5);
  const y = eyes.y + rng.float(14, 18);
  const w = head.rx * rng.float(0.18, 0.28); // half width
  const smile = rng.float(-1, 1); // -1 frown .. 1 grin

  switch (kind) {
    case 'line':
      return path(`M ${pt(x - w, y)} Q ${pt(x, y + smile * 6)} ${pt(x + w, y)}`);
    case 'open': // filled "D", always happy
      return path(`M ${pt(x - w, y)} Q ${pt(x, y + 8 + Math.abs(smile) * 8)} ${pt(x + w, y)} Z`, ' fill="#111"');
    case 'o':
      return circle(x, y, 1.8 + Math.abs(smile) * 1.2);
    case 'wavy': {
      let d = `M ${pt(x - w, y)}`;
      for (let i = 0; i < 4; i++) {
        const x0 = x - w + (i * w) / 2;
        d += ` Q ${pt(x0 + w / 4, y + (i % 2 ? 1.8 : -1.8))} ${pt(x0 + w / 2, y)}`;
      }
      return path(d);
    }
  }
}
