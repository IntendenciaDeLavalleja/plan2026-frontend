FROM node:22.14-alpine AS build

WORKDIR /app

# Vite consumes this value at build time and embeds it in the generated bundle.
ARG VITE_API_BASE_URL=https://mapi.sgdm.lavalleja.uy
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

COPY . ./
RUN npm run build

FROM nginx:1.27-alpine

COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD wget --quiet --spider http://127.0.0.1/healthz || exit 1
