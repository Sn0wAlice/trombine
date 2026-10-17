import type { Rng } from '../../rng.js';
import { HX, HY, type Head } from './head.js';
import type { Palette } from './palette.js';
import { path, pt, smoothClosed, type Pt } from '../util.js';

export interface Hair {
  back: string;
  front: string;
}

export function hair(rng: Rng, head: Head, p: Palette): Hair {
  const color = rng.chance(0.5) ? rng.pick([p.neon, p.neon2]) : rng.pick(['#111118', '#f2f2f2', '#2b2b33', '#c0c4cc']);
  const style = rng.weighted([
    ['mohawk', 25],
    ['undercut', 25],
    ['bob', 22],
    ['buzz', 18],
    ['bald', 10],
  ] as const);
  const fill = ` fill="${color}"`;
  const { rx, ry } = head;
  // Every hair shape gets the left-to-right shading, and strands catching the neon on the lit side.
  const solid = (d: string) => path(d, fill + ' stroke-linejoin="round"') + path(d, p.shade);
  const sheen = (k: number) => {
    let d = '';
    for (let i = 0; i < 3; i++) {
      const [a, b, c] = arc(head, Math.PI + 0.35 + i * 0.22, Math.PI + 1.1 + i * 0.22, 2, k - 0.8 - i * 0.5);
      d += `M ${pt(...a!)} Q ${pt(...b!)} ${pt(...c!)} `;
    }
    return path(d.trim(), ` fill="none" stroke="${p.neon}" stroke-opacity=".5" stroke-width=".5" stroke-linecap="round"`);
  };
  const stubble = path(smoothClosed(arc(head, Math.PI - 0.2, 2 * Math.PI + 0.2, 10, 0.6).concat([[HX + rx * 0.85, HY], [HX, HY - ry * 0.55], [HX - rx * 0.85, HY]])), ' fill="#000" fill-opacity=".28"');

  switch (style) {
    case 'mohawk': {
      // A few tall spikes swept back, rooted inside the skull; shaved sides.
      const spikes = rng.int(3, 5);
      const span = 0.45;
      const step = (2 * span) / spikes;
      const pts: Pt[] = [head.around(-Math.PI / 2 - span - 0.1, -1.5)];
      for (let i = 0; i < spikes; i++) {
        const t0 = -Math.PI / 2 - span + i * step;
        pts.push(head.around(t0, 0.5), head.around(t0 + step / 2 + 0.1, rng.float(7, 12)));
      }
      pts.push(head.around(-Math.PI / 2 + span, 0.5), head.around(-Math.PI / 2 + span + 0.1, -1.5), head.around(-Math.PI / 2, -3));
      const ridge = `M ${pts.map(([x, y]) => pt(x, y)).join(' L ')} Z`;
      // Darker strand line up the middle of each spike.
      let strands = '';
      for (let i = 0; i < spikes; i++) {
        const [bx, by] = head.around(-Math.PI / 2 - span + (i + 0.5) * step, -1);
        const [tx, ty] = pts[2 + i * 2]!;
        strands += `M ${pt(bx, by)} L ${pt(bx + (tx - bx) * 0.75, by + (ty - by) * 0.75)} `;
      }
      return { back: '', front: stubble + solid(ridge) + path(strands.trim(), ' fill="none" stroke="#000" stroke-opacity=".3" stroke-width=".6" stroke-linecap="round"') };
    }
    case 'undercut': {
      // Heavy fringe swept to one side, the other side shaved.
      const s = rng.pick([-1, 1]);
      const outer = arc(head, Math.PI - 0.1, 2 * Math.PI + 0.1, 12, rng.float(2.5, 4));
      const sweep: Pt[] = [
        [HX + s * rx * 0.95, HY + 4],
        [HX + s * rx * 0.4, HY - ry * 0.3],
        [HX - s * rx * 0.3, HY - ry * 0.45],
        [HX - s * rx * 0.8, HY - ry * 0.5],
      ];
      const pts = s > 0 ? [...outer, ...sweep] : [...outer, ...sweep.reverse()];
      return { back: '', front: stubble + solid(smoothClosed(pts)) + sheen(3) };
    }
    case 'bob': {
      // Blunt bangs and straight sides to the jaw.
      const len = ry * rng.float(0.4, 0.75);
      const top = arc(head, Math.PI, 2 * Math.PI, 10, 3);
      const back = solid(smoothClosed([[HX - rx - 3, HY + len], ...top, [HX + rx + 3, HY + len], [HX, HY + len + 1]]));
      const bangY = HY - ry * rng.float(0.15, 0.3);
      const bangs = arc(head, Math.PI + 0.25, 2 * Math.PI - 0.25, 10, 3);
      const front = solid(`M ${bangs.map(([x, y]) => pt(x, y)).join(' L ')} L ${pt(HX + rx * 0.8, bangY)} L ${pt(HX - rx * 0.8, bangY)} Z`);
      return { back, front: front + sheen(3) };
    }
    case 'buzz': {
      // Shaved cap with neon razor lines on one side.
      const s = rng.pick([-1, 1]);
      let lines = '';
      for (let i = 0; i < rng.int(2, 3); i++) {
        const y = HY - ry * (0.15 + i * 0.15);
        lines += `M ${pt(HX + s * rx * 0.55, y - 1)} L ${pt(HX + s * rx * 0.9, y + 1)} `;
      }
      return { back: '', front: solid(smoothClosed(arc(head, Math.PI - 0.2, 2 * Math.PI + 0.2, 10, 0.8).concat([[HX + rx * 0.85, HY], [HX, HY - ry * 0.6], [HX - rx * 0.85, HY]]))) + path(lines.trim(), ` fill="none" stroke="${p.neon2}" stroke-width=".8" stroke-linecap="round"`) };
    }
    case 'bald':
      return { back: '', front: '' };
  }
}

function arc(head: Head, from: number, to: number, n: number, k: number): Pt[] {
  return Array.from({ length: n + 1 }, (_, i) => head.around(from + ((to - from) * i) / n, k));
}
