import type { Theme } from '../../index.js';
import { beard } from './beard.js';
import { body } from './body.js';
import { brows } from './brows.js';
import { badge, headset } from './extras.js';
import { eyes } from './eyes.js';
import { glasses } from './glasses.js';
import { hair } from './hair.js';
import { head } from './head.js';
import { mouth } from './mouth.js';
import { nose } from './nose.js';

const BACKGROUNDS = ['#e8eef7', '#e6f2ee', '#f6eee6', '#efeaf6', '#f4f1e6', '#e4f0f4', '#f3e8ec'];

/** Flat, friendly busts for pro tools: CRM, chat, ticketing. */
export const corpo: Theme = {
  name: 'corpo',
  viewBox: 100,
  render(rng, opts) {
    // Each slot gets its own sub-stream, so adding a slot never changes the others.
    const bg = opts.background ?? rng.fork('background').pick(BACKGROUNDS);
    const h = head(rng.fork('head'));
    const hr = hair(rng.fork('hair'), h);
    const e = eyes(rng.fork('eyes'));
    const g = glasses(rng.fork('glasses'), h, e);
    return (
      `<rect width="100" height="100" fill="${bg}"/>` +
      hr.back +
      h.neck +
      body(rng.fork('body')) +
      badge(rng.fork('badge')) +
      h.svg +
      beard(rng.fork('beard'), h, hr.brow) +
      hr.front +
      e.svg +
      brows(rng.fork('brows'), e, g, hr.brow) +
      nose(rng.fork('nose'), h, e) +
      mouth(rng.fork('mouth'), h) +
      (g?.svg ?? '') +
      headset(rng.fork('headset'), h)
    );
  },
};
