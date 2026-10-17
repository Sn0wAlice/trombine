import type { Theme } from '../../index.js';
import { brows } from './brows.js';
import { cheeks } from './cheeks.js';
import { eyes } from './eyes.js';
import { glasses } from './glasses.js';
import { hair } from './hair.js';
import { head } from './head.js';
import { mouth } from './mouth.js';
import { nose } from './nose.js';

export const doodle: Theme = {
  name: 'doodle',
  viewBox: 100,
  render(rng, opts) {
    // Each slot gets its own sub-stream, so adding a slot never changes the others.
    const h = head(rng.fork('head'));
    const e = eyes(rng.fork('eyes'), h);
    const g = glasses(rng.fork('glasses'), e);
    return (
      `<rect width="100" height="100" fill="${opts.background ?? '#fff'}"/>` +
      '<g fill="none" stroke="#111" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' +
      h.svg +
      hair(rng.fork('hair'), h) +
      cheeks(rng.fork('cheeks'), e, g) +
      e.svg +
      (g?.svg ?? '') +
      brows(rng.fork('brows'), e, g) +
      nose(rng.fork('nose'), e) +
      mouth(rng.fork('mouth'), h, e) +
      '</g>'
    );
  },
};
