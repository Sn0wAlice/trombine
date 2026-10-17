import { createAvatar, themes } from '@trombine/core';
import { Hono } from 'hono';

const CACHE = { 'Cache-Control': 'public, max-age=31536000, immutable' };

/** `toPng` is runtime-specific; without it, .png answers 501. */
export function createApp(toPng?: (svg: string) => Uint8Array<ArrayBuffer>) {
  const app = new Hono();

  // One param for "<seed>.<ext>"; split on the last dot so seeds may contain dots.
  app.get('/:file', (c) => {
    const file = c.req.param('file');
    const dot = file.lastIndexOf('.');
    const seed = file.slice(0, dot);
    const ext = file.slice(dot + 1);
    if (dot < 1 || (ext !== 'svg' && ext !== 'png')) return c.notFound();
    if (seed.length > 256) return c.text('seed too long (max 256 chars)', 400);

    const size = Number(c.req.query('size') ?? 256);
    if (!Number.isInteger(size) || size < 16 || size > 1024) return c.text('size must be an integer from 16 to 1024', 400);
    const theme = c.req.query('theme') ?? 'doodle';
    if (!Object.hasOwn(themes, theme)) return c.text(`unknown theme "${theme}"`, 400);

    const svg = createAvatar(seed, { theme, size });
    if (ext === 'svg') return c.body(svg, 200, { ...CACHE, 'Content-Type': 'image/svg+xml' });
    if (!toPng) return c.text('PNG is not available on this runtime', 501);
    return c.body(toPng(svg), 200, { ...CACHE, 'Content-Type': 'image/png' });
  });

  return app;
}
