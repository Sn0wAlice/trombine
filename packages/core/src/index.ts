import { createRng, type Rng } from './rng.js';
import { corpo } from './themes/corpo/index.js';
import { cyberpunk } from './themes/cyberpunk/index.js';
import { doodle } from './themes/doodle/index.js';

export { createRng, type Rng };

export interface RenderOptions {
  size: number;
  /** "#rrggbb", already validated. Undefined = the theme's own background. */
  background?: string;
}

export interface Theme {
  name: string;
  viewBox: number;
  /** Returns the inner SVG markup. Draw each slot from its own `rng.fork(slotName)`. */
  render(rng: Rng, opts: RenderOptions): string;
}

// "classik" is an alias of the default doodle theme.
export const themes: Record<string, Theme> = { doodle, classik: doodle, corpo, cyberpunk };

export interface AvatarOptions {
  theme?: string;
  size?: number;
  /** Background color as 6 hex digits, with or without "#". */
  bg?: string;
}

export function createAvatar(seed: string, opts: AvatarOptions = {}): string {
  const { theme = 'doodle', size = 256, bg } = opts;
  if (!Object.hasOwn(themes, theme)) throw new Error(`Unknown theme "${theme}"`);
  if (!Number.isInteger(size) || size < 1) throw new Error(`Invalid size "${size}"`);
  // Validated here because it is written into the SVG markup.
  if (bg !== undefined && !/^#?[0-9a-fA-F]{6}$/.test(bg)) throw new Error(`Invalid bg "${bg}", expected 6 hex digits`);
  const background = bg && `#${bg.replace('#', '').toLowerCase()}`;
  const t = themes[theme]!;
  const v = t.viewBox;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${v} ${v}" width="${size}" height="${size}">` +
    t.render(createRng(seed), { size, background }) +
    '</svg>'
  );
}
