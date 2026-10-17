import { readdirSync, readFileSync } from 'node:fs';
import { XMLValidator } from 'fast-xml-parser';
import { describe, expect, it } from 'vitest';
import { createAvatar, createRng, themes, type Theme } from '../src/index.js';

const FIXED = [
  'alice', 'bob', 'carol', 'dave', 'eve', 'mallory', 'trent', 'peggy', 'victor', 'walter',
  '', '0', 'ü', '🐙', 'a very long seed with spaces', 'user@example.com', '<script>', 'trombine', 'doodle', '42',
];
const MANY = Array.from({ length: 1000 }, (_, i) => `seed-${i}`);
const doodle = themes.doodle!;
const THEMES = ['doodle', 'corpo', 'cyberpunk'];

describe('determinism', () => {
  it('matches the snapshot for 20 fixed seeds', () => {
    const out = FIXED.map((s) => createAvatar(s));
    expect(FIXED.map((s) => createAvatar(s))).toEqual(out);
    expect(out).toMatchSnapshot();
  });

  it('matches the snapshot for 20 fixed seeds (corpo)', () => {
    expect(FIXED.map((s) => createAvatar(s, { theme: 'corpo' }))).toMatchSnapshot();
  });

  it('matches the snapshot for 20 fixed seeds (cyberpunk)', () => {
    expect(FIXED.map((s) => createAvatar(s, { theme: 'cyberpunk' }))).toMatchSnapshot();
  });

  it('never uses Math.random in core', () => {
    const dir = new URL('../src/', import.meta.url);
    for (const f of readdirSync(dir, { recursive: true, encoding: 'utf8' }).filter((f) => f.endsWith('.ts'))) {
      expect(readFileSync(new URL(f, dir), 'utf8'), f).not.toContain('Math.random');
    }
  });
});

describe.each(THEMES)('stability (%s)', (name) => {
  it('adding a slot does not change existing slots', () => {
    const theme = themes[name]!;
    const withDummy: Theme = {
      ...theme,
      render(rng, opts) {
        // A new slot, plus stray draws on the parent stream.
        const r = rng.fork('dummy');
        for (let i = 0; i < 50; i++) r.next(), rng.next();
        return theme.render(rng, opts) + '<circle cx="50" cy="50" r="1"/>';
      },
    };
    for (const s of MANY) {
      const base = theme.render(createRng(s), { size: 100 });
      expect(withDummy.render(createRng(s), { size: 100 }).startsWith(base)).toBe(true);
    }
  });
});

describe.each(THEMES)('output (%s)', (theme) => {
  const outputs = MANY.map((s) => createAvatar(s, { theme }));

  it('is valid XML with a 100x100 viewBox', () => {
    for (const svg of outputs) {
      expect(XMLValidator.validate(svg)).toBe(true);
      expect(svg).toMatch(/^<svg [^>]*viewBox="0 0 100 100"/);
    }
  });

  it('keeps every element inside the viewBox', () => {
    const attr = (attrs: string, name: string) => Number(new RegExp(`\\b${name}="([^"]*)"`).exec(attrs)?.[1] ?? 0);
    // Collect offenders and assert once: one expect() per coordinate made this test time out on CI.
    const outside: string[] = [];
    for (const svg of outputs) {
      for (const [, tag, attrs = ''] of svg.matchAll(/<(path|circle|rect)\b([^>]*)>/g)) {
        let coords: number[];
        if (tag === 'path') {
          // All path commands are absolute, so every number is a point or control point coordinate.
          coords = /\bd="([^"]*)"/.exec(attrs)![1]!.match(/-?\d+(\.\d+)?/g)!.map(Number);
        } else if (tag === 'circle') {
          const [cx, cy, r] = ['cx', 'cy', 'r'].map((n) => attr(attrs, n)) as [number, number, number];
          coords = [cx - r, cx + r, cy - r, cy + r];
        } else {
          const [x, y, w, h] = ['x', 'y', 'width', 'height'].map((n) => attr(attrs, n)) as [number, number, number, number];
          coords = [x, x + w, y, y + h];
        }
        if (coords.some((v) => v < 0 || v > 100)) outside.push(`${tag} ${attrs}`);
      }
    }
    expect(outside).toEqual([]);
  });

  it('only references ids it defines, unique per seed', () => {
    const owner = new Map<string, string>();
    const problems: string[] = [];
    for (const [i, svg] of outputs.entries()) {
      const seed = MANY[i]!;
      const ids = new Set([...svg.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]!));
      for (const [, ref] of svg.matchAll(/url\(#([^)]+)\)/g)) if (!ids.has(ref!)) problems.push(`${seed}: missing #${ref}`);
      for (const id of ids) {
        if ((owner.get(id) ?? seed) !== seed) problems.push(`${seed}: id ${id} also used by ${owner.get(id)}`);
        owner.set(id, seed);
      }
    }
    expect(problems).toEqual([]);
  });

  it('honors bg', () => {
    expect(createAvatar('a', { theme, bg: '123abc' })).toContain('<rect width="100" height="100" fill="#123abc"/>');
  });
});

describe('options', () => {
  it('rejects unknown themes and bad sizes', () => {
    expect(() => createAvatar('a', { theme: 'nope' })).toThrow();
    expect(() => createAvatar('a', { theme: 'toString' })).toThrow();
    expect(() => createAvatar('a', { size: 0 })).toThrow();
    for (const bg of ['', 'fff', 'zzzzzz', '"/><script>', '#ff00001']) expect(() => createAvatar('a', { bg }), bg).toThrow();
  });

  it('serves doodle as "classik" too', () => {
    expect(createAvatar('a', { theme: 'classik' })).toBe(createAvatar('a'));
  });

  it('only changes the background with bg', () => {
    const svg = createAvatar('a', { bg: 'FFCC00' });
    expect(svg).toContain('fill="#ffcc00"');
    expect(createAvatar('a', { bg: '#ffcc00' })).toBe(svg);
    expect(svg.replace('#ffcc00', '#fff')).toBe(createAvatar('a'));
  });
});
