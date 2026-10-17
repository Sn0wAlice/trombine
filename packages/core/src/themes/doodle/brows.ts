import type { Rng } from '../../rng.js';
import type { Eyes } from './eyes.js';
import type { Glasses } from './glasses.js';
import { path, pt } from './util.js';

export function brows(rng: Rng, eyes: Eyes, glasses: Glasses | null): string {
  if (!rng.chance(0.7)) return '';
  const mood = rng.pick(['neutral', 'raised', 'angry', 'worried'] as const);
  const gap = rng.float(2.5, 4.5);
  const w = rng.float(3.5, 6);
  // Sit above the glasses frame when there is one.
  const y = (glasses ? glasses.top : eyes.y - eyes.size) - gap - (mood === 'raised' ? 2 : 0);
  const tilt = { neutral: 0, raised: 0, angry: 2.2, worried: -2.2 }[mood]; // > 0 = inner end lower
  const arch = mood === 'raised' ? 2.5 : 0.8;

  return eyes.xs
    .map((x, i) => {
      const inward = i === 0 ? 1 : -1;
      return path(`M ${pt(x - inward * w, y)} Q ${pt(x, y - arch * 2)} ${pt(x + inward * w, y + tilt)}`);
    })
    .join('');
}
