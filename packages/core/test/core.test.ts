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

describe('determinism', () => {
  it('matches the snapshot for 20 fixed seeds', () => {
    const out = FIXED.map((s) => createAvatar(s));
    expect(FIXED.map((s) => createAvatar(s))).toEqual(out);
    expect(out).toMatchSnapshot();
  });

  it('never uses Math.random in core', () => {
    const dir = new URL('../src/', import.meta.url);
    for (const f of readdirSync(dir, { recursive: true, encoding: 'utf8' }).filter((f) => f.endsWith('.ts'))) {
      expect(readFileSync(new URL(f, dir), 'utf8'), f).not.toContain('Math.random');
    }
  });
});

describe('stability', () => {
  it('adding a slot does not change existing slots', () => {
    const withDummy: Theme = {
      ...doodle,
      render(rng, opts) {
        // A new slot, plus stray draws on the parent stream.
        const r = rng.fork('dummy');
        for (let i = 0; i < 50; i++) r.next(), rng.next();
        return doodle.render(rng, opts) + '<circle cx="50" cy="50" r="1"/>';
      },
    };
    for (const s of MANY) {
      const base = doodle.render(createRng(s), { size: 100 });
      expect(withDummy.render(createRng(s), { size: 100 }).startsWith(base)).toBe(true);
    }
  });
});

describe('output', () => {
  const outputs = MANY.map((s) => createAvatar(s));

  it('is valid XML with a 100x100 viewBox', () => {
    for (const svg of outputs) {
      expect(XMLValidator.validate(svg)).toBe(true);
      expect(svg).toMatch(/^<svg [^>]*viewBox="0 0 100 100"/);
    }
  });

  it('keeps every element inside the viewBox', () => {
    const attr = (attrs: string, name: string) => Number(new RegExp(`\\b${name}="([^"]*)"`).exec(attrs)?.[1] ?? 0);
    for (const svg of outputs) {
      for (const [, tag, attrs = ''] of svg.matchAll(/<(path|circle|rect)\b([^>]*)>/g)) {
        let xs: number[];
        let ys: number[];
        if (tag === 'path') {
          // All path commands are absolute, so every number pair is a point or control point.
          const nums = /\bd="([^"]*)"/.exec(attrs)![1]!.match(/-?\d+(\.\d+)?/g)!.map(Number);
          xs = nums.filter((_, i) => i % 2 === 0);
          ys = nums.filter((_, i) => i % 2 === 1);
        } else if (tag === 'circle') {
          const [cx, cy, r] = ['cx', 'cy', 'r'].map((n) => attr(attrs, n)) as [number, number, number];
          xs = [cx - r, cx + r];
          ys = [cy - r, cy + r];
        } else {
          const [x, y, w, h] = ['x', 'y', 'width', 'height'].map((n) => attr(attrs, n)) as [number, number, number, number];
          xs = [x, x + w];
          ys = [y, y + h];
        }
        for (const v of [...xs, ...ys]) expect(v >= 0 && v <= 100, `${tag} ${attrs}`).toBe(true);
      }
    }
  });

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
