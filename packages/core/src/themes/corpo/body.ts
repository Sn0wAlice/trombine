import type { Rng } from '../../rng.js';
import { HX } from './head.js';
import { path, pt, rect } from '../util.js';

const CLOTHES = ['#1f2a44', '#2f3b52', '#3c4a5c', '#55606e', '#6b2737', '#2e5e5a', '#4b3f7a', '#8a7f6a', '#2d6a9f'];
const SHIRTS = ['#ffffff', '#e3ecf7', '#f4efe6'];
const TIES = ['#9b2c2c', '#1f3b73', '#2e5e5a', '#b7791f', '#4b3f7a'];
const FOLD = ' fill="none" stroke="#000" stroke-opacity=".22" stroke-width="1" stroke-linecap="round"';

export function body(rng: Rng): string {
  const color = rng.pick(CLOTHES);
  const style = rng.weighted([
    ['suit', 35],
    ['sweater', 25],
    ['shirt', 20],
    ['turtleneck', 20],
  ] as const);
  const sw = rng.float(34, 40); // half shoulder width
  const torso = path(
    `M ${pt(HX - sw, 100)} C ${pt(HX - sw, 84)} ${pt(HX - sw + 8, 75)} ${pt(HX - 12, 74)}` +
      ` L ${pt(HX + 12, 74)} C ${pt(HX + sw - 8, 75)} ${pt(HX + sw, 84)} ${pt(HX + sw, 100)} Z`,
    ` fill="${color}"`,
  );

  switch (style) {
    case 'suit': {
      const shirt = path(`M ${pt(HX - 8, 74)} L ${pt(HX, 90)} L ${pt(HX + 8, 74)} Z`, ` fill="${rng.pick(SHIRTS)}"`);
      const tie = rng.chance(0.6)
        ? path(`M ${pt(HX - 1.6, 76)} L ${pt(HX + 1.6, 76)} L ${pt(HX + 2.6, 88)} L ${pt(HX, 91)} L ${pt(HX - 2.6, 88)} Z`, ` fill="${rng.pick(TIES)}"`)
        : '';
      const lapels = path(`M ${pt(HX - 8, 74)} L ${pt(HX - 4, 86)} M ${pt(HX + 8, 74)} L ${pt(HX + 4, 86)}`, FOLD);
      return torso + shirt + tie + lapels;
    }
    case 'sweater':
      return torso + path(`M ${pt(HX - 9, 74.5)} Q ${pt(HX, 82)} ${pt(HX + 9, 74.5)}`, FOLD.replace('width="1"', 'width="2.4"'));
    case 'shirt': {
      const collar = ` fill="${rng.pick(SHIRTS)}"`;
      return (
        torso +
        path(`M ${pt(HX - 10, 73.5)} L ${pt(HX - 1, 80)} L ${pt(HX - 4, 72.5)} Z`, collar) +
        path(`M ${pt(HX + 10, 73.5)} L ${pt(HX + 1, 80)} L ${pt(HX + 4, 72.5)} Z`, collar) +
        path(`M ${pt(HX, 81)} L ${pt(HX, 100)}`, FOLD)
      );
    }
    case 'turtleneck':
      return (
        torso +
        rect(HX - 8.5, 64, 17, 13, 4, ` fill="${color}"`) +
        path(`M ${pt(HX - 7, 68.5)} Q ${pt(HX, 70)} ${pt(HX + 7, 68.5)} M ${pt(HX - 7, 72)} Q ${pt(HX, 73.5)} ${pt(HX + 7, 72)}`, FOLD)
      );
  }
}
