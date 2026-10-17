import { serve } from '@hono/node-server';
import { Resvg } from '@resvg/resvg-js';
import { createApp } from './app.js';

const app = createApp((svg) => new Uint8Array(new Resvg(svg).render().asPng()));

serve({ fetch: app.fetch, port: Number(process.env.PORT ?? 3000) }, ({ port }) => {
  console.log(`trombine listening on http://localhost:${port}`);
});
