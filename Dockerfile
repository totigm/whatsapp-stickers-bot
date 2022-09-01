# Build TS project into JS code
FROM node:16-alpine AS builder

WORKDIR /app

COPY . .

RUN npm install && npm run build

# Get JS code and install production dependencies only
# Install Chromium and FFMPEG for Puppeteer
FROM node:16-alpine AS production

WORKDIR /app

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD="true" \
    CHROME_BIN=/usr/bin/chromium-browser \
    IS_DOCKER_CONTAINER=true \
    NODE_ENV=prod

RUN set -x \
    && apk update \
    && apk upgrade \
    && apk add --no-cache \
    chromium \
    ffmpeg

COPY --from=builder ./app/dist ./dist 
COPY package*.json .
COPY *.wwebjs_auth .wwebjs_auth

RUN npm install --omit=dev

CMD npm run prod
