FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY web/package.json web/package.json
RUN npm ci --workspace web
COPY web ./web
ARG VITE_SERVER_BASE_URL=http://localhost:1234
ENV VITE_SERVER_BASE_URL=$VITE_SERVER_BASE_URL
RUN npm run -w web build

FROM nginx:alpine
COPY web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/web/dist /usr/share/nginx/html
EXPOSE 80
