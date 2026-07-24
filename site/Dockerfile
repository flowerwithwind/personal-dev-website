# 个人站（Astro 静态）→ nginx
# 服务器模式 base=/ ，便于 http://IP:18083/ 访问，并可与同机 HTTP 演示站内嵌

FROM node:22-alpine AS build

ARG NPM_REGISTRY=https://registry.npmjs.org
ARG CACHEBUST=1
# server | github
ARG DEPLOY_TARGET=server
# 对外访问地址（生产部署应显式传入；默认仅用于本地构建）
ARG SERVER_PUBLIC_URL=http://127.0.0.1:18083

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm config set registry ${NPM_REGISTRY} \
  && npm ci

RUN echo "cachebust=${CACHEBUST}"

COPY . .

ENV DEPLOY_TARGET=${DEPLOY_TARGET}
ENV SERVER_PUBLIC_URL=${SERVER_PUBLIC_URL}

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --retries=5 --start-period=10s \
  CMD wget -qO- http://127.0.0.1/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
