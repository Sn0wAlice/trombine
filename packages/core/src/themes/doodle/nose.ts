import type { Rng } from '../../rng.js';
import type { Eyes } from './eyes.js';
import { CX, dot, path, pt } from './util.js';

export function nose(rng: Rng, eyes: Eyes): string {
  if (!rng.chance(0.5)) return '';
  const kind = rng.pick(['L', 'c', 'dot'] as const);
  const x = CX + rng.float(-1.5, 1.5);
  const y = eyes.y + rng.float(6, 8.5);
  switch (kind) {
    case 'L':
      return path(`M ${pt(x, y - 3)} L ${pt(x, y + 1)} L ${pt(x + 2, y + 1)}`);
    case 'c':
      return path(`M ${pt(x + 1.5, y - 2)} Q ${pt(x - 2.5, y)} ${pt(x + 1.5, y + 2)}`);
    case 'dot':
      return dot(x, y, 0.9);
  }
}
