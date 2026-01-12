# ============================================
# PRODUCTION DOCKERFILE (Multi-Stage Build)
# ============================================

ARG TARGETPLATFORM=linux/amd64

# ------------------- STAGE 1: BUILD -------------------
FROM --platform=${TARGETPLATFORM} node:22-alpine AS build

WORKDIR /app

# ============ BUILD-TIME ARGUMENTS ============
# WHY ARG?
# - Vite replaces import.meta.env.VITE_* at BUILD TIME
# - These must be available when 'pnpm run build' runs
# - Passed via docker-compose build.args or --build-arg
ARG VITE_CLERK_PUBLISHABLE_KEY
ARG VITE_API_BASE_URL_DEV
ARG VITE_API_BASE_URL_PROD
ARG VITE_API_BASE_URL

# WHY ENV after ARG?
# - ARG is only available during build
# - ENV makes them available to the build command
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY
ENV VITE_API_BASE_URL_DEV=$VITE_API_BASE_URL_DEV
ENV VITE_API_BASE_URL_PROD=$VITE_API_BASE_URL_PROD
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Install pnpm
RUN npm install -g pnpm

# Copy package files first (layer caching)
COPY package.json pnpm-lock.yaml ./

# Install dependencies with exact versions
RUN pnpm install --frozen-lockfile

# Copy all source files
COPY . .

# Build the application
# VITE_* environment variables are embedded during this step
RUN pnpm run build

# ------------------- STAGE 2: PRODUCTION -------------------
# Redeclare ARG after FROM (ARGs don't persist across stages)
ARG TARGETPLATFORM=linux/amd64
FROM --platform=${TARGETPLATFORM} nginx:alpine AS production

# Copy built files from build stage to nginx html directory
# No nested path needed - the reverse proxy handles /cdith/nutritionscanner/
# and Vite's base config already embeds correct asset paths (/cdith/nutritionscanner/assets/...)
COPY --from=build /app/dist /usr/share/nginx/html

# Create nginx configuration for SPA
# The server nginx reverse proxy routes /cdith/nutritionscanner/ → this container at /
# Asset paths in HTML already have /cdith/nutritionscanner/ prefix from Vite build
RUN echo 'server { \
    listen 3006; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    \
    # Handle all routes - SPA fallback to index.html \
    location / { \
    try_files $uri $uri/ /index.html; \
    } \
    \
    # Enable gzip compression \
    gzip on; \
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript; \
    \
    # Cache static assets \
    location ~* \\.(?:css|js|jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot)$ { \
    expires 1y; \
    add_header Cache-Control "public, immutable"; \
    } \
    }' > /etc/nginx/conf.d/default.conf

EXPOSE 3006

CMD ["nginx", "-g", "daemon off;"]
