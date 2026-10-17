import type { Eyes } from './eyes.js';
import { HX } from './head.js';
import { circle, path, pt } from '../util.js';

/** Bridge shadow, underside, nostrils, tip highlight. Derived from the eyes, so no random draws. */
export function nose(eyes: Eyes): string {
  const top = eyes.y + 0.5;
  const y = eyes.y + 7; // tip
  return (
    path(`M ${pt(HX + 0.6, top)} Q ${pt(HX + 2.4, y - 3.5)} ${pt(HX + 2, y - 0.6)} L ${pt(HX + 1, y - 1.2)} Q ${pt(HX + 1.2, y - 3.8)} ${pt(HX + 0.6, top)} Z`, ' fill="#000" fill-opacity=".22"') +
    path(`M ${pt(HX - 2.4, y)} Q ${pt(HX, y + 1.6)} ${pt(HX + 2.4, y)} Q ${pt(HX, y + 0.6)} ${pt(HX - 2.4, y)} Z`, ' fill="#000" fill-opacity=".32"') +
    path(`M ${pt(HX - 1.9, y + 0.1)} Q ${pt(HX - 1.4, y + 0.9)} ${pt(HX - 0.6, y + 0.6)} M ${pt(HX + 1.9, y + 0.1)} Q ${pt(HX + 1.4, y + 0.9)} ${pt(HX + 0.6, y + 0.6)}`, ' fill="none" stroke="#000" stroke-opacity=".4" stroke-width=".5" stroke-linecap="round"') +
    circle(HX - 0.6, y - 1.2, 0.7, ' fill="#fff" fill-opacity=".14"')
  );
}
