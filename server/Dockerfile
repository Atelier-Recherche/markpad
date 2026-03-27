FROM node:alpine AS deps
WORKDIR /app
COPY package.json ./
COPY server/package.json server/package.json
RUN npm install --workspace server

FROM node:alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY server ./server
RUN npm run -w server build

FROM node:alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/server/dist ./server/dist
COPY --from=build /app/server/package.json ./server/package.json
COPY --from=deps /app/node_modules ./node_modules
EXPOSE 1234
CMD ["node", "server/dist/index.js"]
