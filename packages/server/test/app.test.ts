import { describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';

describe('server', () => {
  const app = createApp();

  it('serves an immutable svg', async () => {
    const res = await app.request('/alice.svg?size=64');
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toBe('image/svg+xml');
    expect(res.headers.get('cache-control')).toBe('public, max-age=31536000, immutable');
    expect(await res.text()).toContain('width="64"');
  });

  it('validates input', async () => {
    for (const url of ['/a.svg?size=8', '/a.svg?size=2000', '/a.svg?size=abc', '/a.svg?theme=constructor', `/${'x'.repeat(257)}.svg`]) {
      expect((await app.request(url)).status, url).toBe(400);
    }
    expect((await app.request('/a.gif')).status).toBe(404);
  });

  it('answers 501 for png without a renderer, 200 with one', async () => {
    expect((await app.request('/a.png')).status).toBe(501);
    const res = await createApp(() => new Uint8Array([1])).request('/a.png');
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toBe('image/png');
  });
});
