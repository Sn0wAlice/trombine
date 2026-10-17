import type { Rng } from '../../rng.js';
import { HX, INK, type Head } from './head.js';
import type { Palette } from './palette.js';
import { circle, path, pt, rect } from '../util.js';

export function mouth(rng: Rng, head: Head, p: Palette): string {
  const kind = rng.weighted([
    ['line', 35],
    ['smirk', 25],
    ['lips', 18],
    ['mask', 22],
  ] as const);
  const y = head.mouthY;
  const w = rng.float(3, 4.2);
  const ink = ` fill="none" stroke="${INK}" stroke-width="1.3" stroke-linecap="round"`;

  // Lips are translucent dark over the skin, so they read on every skin tone.
  const lips = (color: string, upper: string, lower: string) =>
    path(`M ${pt(HX - w, y)} Q ${pt(HX - w * 0.5, y - 1.4)} ${pt(HX, y - 0.7)} Q ${pt(HX + w * 0.5, y - 1.4)} ${pt(HX + w, y)} Q ${pt(HX, y + 0.3)} ${pt(HX - w, y)} Z`, ` fill="${color}" fill-opacity="${upper}"`) +
    path(`M ${pt(HX - w * 0.85, y + 0.2)} Q ${pt(HX, y + 2.6)} ${pt(HX + w * 0.85, y + 0.2)} Q ${pt(HX, y + 0.6)} ${pt(HX - w * 0.85, y + 0.2)} Z`, ` fill="${color}" fill-opacity="${lower}"`) +
    path(`M ${pt(HX - w * 0.6, y + 3.4)} Q ${pt(HX, y + 4.1)} ${pt(HX + w * 0.6, y + 3.4)}`, ' fill="none" stroke="#000" stroke-opacity=".2" stroke-width=".8" stroke-linecap="round"');

  switch (kind) {
    case 'line':
      return lips('#000', '.32', '.16') + path(`M ${pt(HX - w, y)} Q ${pt(HX, y + 0.5)} ${pt(HX + w, y)}`, ink.replace('1.3', '.7'));
    case 'smirk':
      return lips('#000', '.32', '.16') + path(`M ${pt(HX - w, y + 0.2)} Q ${pt(HX + w * 0.4, y + 0.7)} ${pt(HX + w + 0.4, y - 1)}`, ink.replace('1.3', '.8'));
    case 'lips': {
      const c = rng.pick([p.neon, p.neon2, '#1a1a24']);
      return lips(c, '1', '.85') + path(`M ${pt(HX - w, y)} Q ${pt(HX, y + 0.5)} ${pt(HX + w, y)}`, ink.replace('1.3', '.6')) + path(`M ${pt(HX - 1, y + 1.2)} L ${pt(HX + 0.6, y + 1.1)}`, ' stroke="#fff" stroke-opacity=".5" stroke-width=".45" stroke-linecap="round"');
    }
    case 'mask': {
      // Respirator over the lower face, vents glowing.
      const mw = head.rx * 0.78;
      const top = y - 4.5;
      let vents = '';
      for (let i = -1; i <= 1; i++) vents += `M ${pt(HX + i * 2.2, top + 3)} L ${pt(HX + i * 2.2, top + 7)} `;
      return (
        rect(HX - mw, top, 2 * mw, 9, 4, ' fill="#1c1c26" stroke="#4b5563" stroke-width=".6"') +
        path(vents.trim(), ` stroke="${p.neon}" stroke-width=".9" stroke-linecap="round"${p.glow}`) +
        path(vents.trim(), ` stroke="${p.neon}" stroke-width=".7" stroke-linecap="round"`) +
        circle(HX - mw + 1.5, top + 4.5, 2.2, ' fill="#2a2f3a" stroke="#4b5563" stroke-width=".5"') +
        circle(HX + mw - 1.5, top + 4.5, 2.2, ' fill="#2a2f3a" stroke="#4b5563" stroke-width=".5"')
      );
    }
  }
}
