// cyrb53: fast 53-bit string hash (public domain, bryc).
function cyrb53(str: string): number {
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

// mulberry32: tiny 32-bit PRNG, returns floats in [0, 1).
function mulberry32(a: number): () => number {
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface Rng {
  next(): number;
  /** Float in [min, max). */
  float(min: number, max: number): number;
  /** Integer in [min, max], both inclusive. */
  int(min: number, max: number): number;
  pick<T>(items: readonly T[]): T;
  chance(p: number): boolean;
  weighted<T>(items: readonly (readonly [T, number])[]): T;
  /** Independent sub-stream: hash(seed + ":" + name). Never affected by draws on the parent. */
  fork(name: string): Rng;
}

export function createRng(seed: string): Rng {
  const next = mulberry32(cyrb53(seed) % 4294967296);
  const float = (min: number, max: number) => min + next() * (max - min);
  return {
    next,
    float,
    int: (min, max) => Math.floor(float(min, max + 1)),
    pick: (items) => items[Math.floor(next() * items.length)]!,
    chance: (p) => next() < p,
    weighted: (items) => {
      let r = next() * items.reduce((sum, [, w]) => sum + w, 0);
      for (const [item, w] of items) if ((r -= w) < 0) return item;
      return items[items.length - 1]![0];
    },
    fork: (name) => createRng(`${seed}:${name}`),
  };
}
