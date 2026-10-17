#!/usr/bin/env node
import { parseArgs } from 'node:util';
import { createAvatar } from '@trombine/core';

const usage = 'usage: trombine <seed> [--theme doodle] [--size 256] > out.svg';

try {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: { theme: { type: 'string', default: 'doodle' }, size: { type: 'string', default: '256' } },
  });
  const seed = positionals[0];
  if (seed === undefined) throw new Error(usage);
  process.stdout.write(createAvatar(seed, { theme: values.theme, size: Number(values.size) }) + '\n');
} catch (err) {
  console.error((err as Error).message);
  process.exit(1);
}
