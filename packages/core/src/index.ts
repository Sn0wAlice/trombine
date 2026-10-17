import { createRng, type Rng } from './rng.js';
import { doodle } from './themes/doodle/index.js';

export { createRng, type Rng };

export interface RenderOptions {
  size: number;
}

export interface Theme {
  name: string;
  viewBox: number;
  /** Returns the inner SVG markup. Draw each slot from its own `rng.fork(slotName)`. */
  render(rng: Rng, opts: RenderOptions): string;
}

export const themes: Record<string, Theme> = { doodle };

export function createAvatar(seed: string, opts: { theme?: string; size?: number } = {}): string {
  const { theme = 'doodle', size = 256 } = opts;
  if (!Object.hasOwn(themes, theme)) throw new Error(`Unknown theme "${theme}"`);
  if (!Number.isInteger(size) || size < 1) throw new Error(`Invalid size "${size}"`);
  const t = themes[theme]!;
  const v = t.viewBox;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${v} ${v}" width="${size}" height="${size}">` +
    t.render(createRng(seed), { size }) +
    '</svg>'
  );
}
