FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY server/package.json server/package.json
COPY packages/collab-note/package.json packages/collab-note/package.json
RUN npm ci --workspace @markpad/collab-note --workspace server

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json ./
COPY packages/collab-note packages/collab-note
COPY server ./server
RUN npm run -w @markpad/collab-note build && npm run -w server build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/server/dist ./server/dist
COPY --from=build /app/server/package.json ./server/package.json
COPY --from=build /app/packages/collab-note/dist ./packages/collab-note/dist
COPY --from=build /app/packages/collab-note/package.json ./packages/collab-note/package.json
COPY --from=deps /app/node_modules ./node_modules
EXPOSE 1234
CMD ["node", "server/dist/index.js"]
