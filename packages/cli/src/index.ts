#!/usr/bin/env node
import { parseArgs } from 'node:util';
import { createAvatar } from '@trombine/core';

const usage = 'usage: trombine <seed> [--theme doodle] [--size 256] [--bg ffcc00] > out.svg';

try {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: { theme: { type: 'string', default: 'doodle' }, size: { type: 'string', default: '256' }, bg: { type: 'string' } },
  });
  const seed = positionals[0];
  if (seed === undefined) throw new Error(usage);
  process.stdout.write(createAvatar(seed, { theme: values.theme, size: Number(values.size), bg: values.bg }) + '\n');
} catch (err) {
  console.error((err as Error).message);
  process.exit(1);
}
