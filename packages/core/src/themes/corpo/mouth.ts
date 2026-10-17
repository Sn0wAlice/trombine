import type { Rng } from '../../rng.js';
import { HX, INK, type Head } from './head.js';
import { path, pt } from '../util.js';

/** Always friendly: it's for work. */
export function mouth(rng: Rng, head: Head): string {
  const kind = rng.weighted([
    ['smile', 60],
    ['grin', 25],
    ['neutral', 15],
  ] as const);
  const y = head.mouthY;
  const w = rng.float(3, 4.5);
  switch (kind) {
    case 'smile':
      return path(`M ${pt(HX - w, y)} Q ${pt(HX, y + rng.float(2, 3))} ${pt(HX + w, y)}`, ` fill="none" stroke="${INK}" stroke-width="1.4" stroke-linecap="round"`);
    case 'grin':
      return path(`M ${pt(HX - w, y)} Q ${pt(HX, y + 5)} ${pt(HX + w, y)} Z`, ` fill="#7a2e2e" stroke="${INK}" stroke-width="1" stroke-linejoin="round"`);
    case 'neutral':
      return path(`M ${pt(HX - w * 0.6, y + 0.5)} L ${pt(HX + w * 0.6, y + 0.5)}`, ` fill="none" stroke="${INK}" stroke-width="1.4" stroke-linecap="round"`);
  }
}
