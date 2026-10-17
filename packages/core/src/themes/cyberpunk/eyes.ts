import type { Rng } from '../../rng.js';
import { HX, HY, INK, type Head } from './head.js';
import type { Palette } from './palette.js';
import { circle, path, pt, rect } from '../util.js';

export interface Eyes {
  svg: string;
  xs: readonly [number, number];
  y: number;
  visor: boolean;
}

export function eyes(rng: Rng, head: Head, p: Palette): Eyes {
  const kind = rng.weighted([
    ['neon', 45],
    ['visor', 30],
    ['cyber', 25],
  ] as const);
  const spread = rng.float(6.5, 7.5);
  const xs = [HX - spread, HX + spread] as const;
  const y = HY + rng.float(0.5, 2);
  const iris = rng.pick([p.neon, p.neon2]);

  const gaze = rng.float(-0.5, 0.5);

  // Almond eye: dim sclera, glowing iris, pupil, catchlight, winged upper lid.
  const eye = (x: number, out: number) => {
    const w = 2.7;
    const almond = `M ${pt(x - w, y)} Q ${pt(x, y - 2.4)} ${pt(x + w, y)} Q ${pt(x, y + 2.2)} ${pt(x - w, y)} Z`;
    const lid = `M ${pt(x - out * w, y + 0.1)} Q ${pt(x, y - 2.6)} ${pt(x + out * w, y - 0.1)} L ${pt(x + out * (w + 1.3), y - 1.1)}`;
    const ix = x + gaze;
    return (
      path(almond, out > 0 ? ' fill="#b9b4c6"' : ' fill="#e6e2ee"') +
      circle(ix, y - 0.1, 1.2, ` fill="${iris}"${p.glow}`) +
      circle(ix, y - 0.1, 1.1, ` fill="${iris}"`) +
      circle(ix, y - 0.1, 0.5, ` fill="${INK}"`) +
      circle(ix - 0.45, y - 0.6, 0.32, ' fill="#fff"') +
      path(lid, ` fill="none" stroke="${INK}" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"`) +
      path(`M ${pt(x - w * 0.8, y + 0.7)} Q ${pt(x, y + 1.4)} ${pt(x + w * 0.8, y + 0.7)}`, ' fill="none" stroke="#000" stroke-opacity=".35" stroke-width=".5" stroke-linecap="round"')
    );
  };

  if (kind === 'visor') {
    // Wide band across both eyes, frames derived from eye positions.
    const x0 = HX - head.rx - 1;
    const w = 2 * (head.rx + 1);
    const band = (attrs: string) => rect(x0, y - 3.4, w, 6.8, 3.4, attrs);
    return {
      svg:
        band(` fill="url(#neon-${p.id})"${p.glow}`) +
        band(` fill="url(#neon-${p.id})" fill-opacity=".92" stroke="${INK}" stroke-width=".8"`) +
        path(`M ${pt(x0 + 3, y - 1.8)} L ${pt(x0 + w - 3, y - 1.8)}`, ' stroke="#fff" stroke-opacity=".55" stroke-width=".6" stroke-linecap="round"'),
      xs,
      y,
      visor: true,
    };
  }

  if (kind === 'cyber') {
    // One eye replaced by a glowing optic in a metal socket.
    const i = rng.int(0, 1);
    const cx = xs[i]!;
    const optic =
      circle(cx, y, 3.6, ' fill="#1a1a24" stroke="#6b7280" stroke-width=".6"') +
      circle(cx, y, 2, ` fill="none" stroke="${p.neon}" stroke-width=".5" stroke-opacity=".7"`) +
      circle(cx, y, 1.3, ` fill="${p.neon}"${p.glow}`) +
      circle(cx, y, 1.1, ` fill="${p.neon}"`) +
      path(`M ${pt(cx - 3.6, y)} L ${pt(cx - 5, y)} M ${pt(cx, y + 3.6)} L ${pt(cx, y + 5.2)}`, ' stroke="#6b7280" stroke-width=".6"');
    return { svg: i === 0 ? optic + eye(xs[1], 1) : eye(xs[0], -1) + optic, xs, y, visor: false };
  }

  return { svg: eye(xs[0], -1) + eye(xs[1], 1), xs, y, visor: false };
}
