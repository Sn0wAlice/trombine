# syntax=docker/dockerfile:1

# --- build: install, compile, then extract a standalone server with prod deps only
FROM node:24-alpine AS build
RUN npm install -g pnpm@10.34.7
WORKDIR /repo
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/core/package.json packages/core/
COPY packages/server/package.json packages/server/
COPY packages/cli/package.json packages/cli/
RUN pnpm install --frozen-lockfile
COPY tsconfig.base.json ./
COPY packages packages
RUN pnpm --filter @trombine/core --filter @trombine/server build \
 && pnpm --filter @trombine/server deploy --prod --legacy /out

# --- runtime: Node + server + core + resvg, nothing else
FROM node:24-alpine
ENV NODE_ENV=production PORT=3000
WORKDIR /app
COPY --from=build /out .
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s CMD node -e "fetch('http://127.0.0.1:'+process.env.PORT+'/healthcheck.svg?size=16').then(r=>process.exit(r.ok?0:1),()=>process.exit(1))"
CMD ["node", "dist/node.js"]
