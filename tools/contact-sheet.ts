// Renders N random avatars in a grid, seed under each, to one PNG. For eyeballing ugly combos.
// usage: node tools/contact-sheet.ts [count=400] [out=docs/doodle-preview.png] [theme=doodle]
import { writeFileSync } from 'node:fs';
import { Resvg } from '@resvg/resvg-js';
import { createAvatar } from '@trombine/core';

const [count = '400', out = 'docs/doodle-preview.png', theme = 'doodle'] = process.argv.slice(2);
const n = Number(count);
const cols = Math.ceil(Math.sqrt(n));
const cell = { w: 120, h: 136, avatar: 110 };

let body = '';
for (let i = 0; i < n; i++) {
  const seed = Math.random().toString(36).slice(2, 10); // base36 only: safe to inline in SVG
  const x = (i % cols) * cell.w + (cell.w - cell.avatar) / 2;
  const y = Math.floor(i / cols) * cell.h + 5;
  body += createAvatar(seed, { theme, size: cell.avatar }).replace('<svg ', `<svg x="${x}" y="${y}" `);
  body += `<text x="${x + cell.avatar / 2}" y="${y + cell.avatar + 14}">${seed}</text>`;
}

const width = cols * cell.w;
const height = Math.ceil(n / cols) * cell.h;
const sheet =
  `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">` +
  `<rect width="100%" height="100%" fill="#f4f4f4"/>` +
  `<g font-family="monospace" font-size="12" fill="#555" text-anchor="middle">${body}</g></svg>`;

const png = new Resvg(sheet, { font: { defaultFontFamily: 'Menlo' } }).render().asPng();
writeFileSync(out, png);
console.log(`wrote ${n} avatars to ${out} (${width}x${height})`);
