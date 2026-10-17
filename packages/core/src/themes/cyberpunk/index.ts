import type { Theme } from '../../index.js';
import { body } from './body.js';
import { brows } from './brows.js';
import { eyes } from './eyes.js';
import { hair } from './hair.js';
import { head } from './head.js';
import { implant, tattoo } from './mods.js';
import { mouth } from './mouth.js';
import { nose } from './nose.js';
import { defs, palette } from './palette.js';
import { glitch, scanlines, scene } from './scene.js';

/** Night city, neon rim light, chrome and implants. */
export const cyberpunk: Theme = {
  name: 'cyberpunk',
  viewBox: 100,
  render(rng, opts) {
    // Each slot gets its own sub-stream, so adding a slot never changes the others.
    const p = palette(rng.fork('palette'));
    const h = head(rng.fork('head'), p);
    const b = body(rng.fork('body'), h, p);
    const hr = hair(rng.fork('hair'), h, p);
    const e = eyes(rng.fork('eyes'), h, p);
    return (
      defs(p) +
      scene(rng.fork('scene'), p, opts.background) +
      // Portrait crop: character scaled 1.2x around (50, 90). The tallest mohawk tip lands at y ~0.6,
      // the bust bottom is cut by the frame on purpose.
      '<g transform="translate(50 90) scale(1.2) translate(-50 -90)">' +
      b.back +
      hr.back +
      h.neck +
      b.front +
      h.svg +
      tattoo(rng.fork('tattoo'), e, p) +
      nose(e) +
      hr.front +
      e.svg +
      brows(rng.fork('brows'), e) +
      implant(rng.fork('implant'), h, p) +
      mouth(rng.fork('mouth'), h, p) +
      '</g>' +
      glitch(rng.fork('glitch'), p) +
      scanlines(rng.fork('scanlines'))
    );
  },
};
