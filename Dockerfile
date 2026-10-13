# startnet.in: React (Vite) front end + NestJS API in one Node process (same steps as nixpacks.toml).
# Used when the Coolify app's build pack is "Dockerfile"; with Nixpacks, nixpacks.toml applies instead.
FROM node:22-alpine AS build
WORKDIR /app
COPY client/package.json client/package-lock.json client/
COPY server/package.json server/package-lock.json server/
RUN npm ci --prefix client --include=dev && npm ci --prefix server --include=dev
COPY client client
COPY server server
RUN npm run build --prefix client && npm run build --prefix server && npm prune --prefix server --omit=dev

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production PORT=4321
COPY --from=build /app/client/dist client/dist
COPY --from=build /app/server/dist server/dist
COPY --from=build /app/server/node_modules server/node_modules
COPY --from=build /app/server/package.json server/package.json
COPY server/data server/data
EXPOSE 4321
CMD ["node", "server/dist/main.js"]
