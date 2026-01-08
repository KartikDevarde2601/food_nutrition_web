# ============================================
# PRODUCTION DOCKERFILE (Multi-Stage Build)
# ============================================
# ------------------- STAGE 1: BUILD -------------------
# WHY "AS build"?
# - Names this stage so we can reference it later
FROM node:22-alpine AS build
WORKDIR /app
# WHY install pnpm?
# - Required to install dependencies
RUN npm install -g pnpm
# WHY copy package files first?
# - Layer caching optimization (same as development)
COPY package.json pnpm-lock.yaml ./
# WHY --frozen-lockfile?
# - Ensures exact versions from lockfile are installed
# - Fails if lockfile is out of sync (catches errors)
RUN pnpm install --frozen-lockfile
# NOW copy all source files
# WHY after dependencies?
# - Source code changes frequently
# - Dependencies change rarely
# - This order maximizes cache hits
COPY . .
# WHY run build?
# - Creates optimized production bundle in /app/dist
# - Minified, tree-shaken, code-split
RUN pnpm run build
# ------------------- STAGE 2: PRODUCTION -------------------
# WHY nginx:alpine?
# - Nginx is the gold standard for serving static files
# - Alpine variant is tiny (~25MB)
# - Handles gzip, caching, routing efficiently
FROM nginx:alpine AS production
# WHY remove default nginx files?
# - Clean slate for our application
RUN rm -rf /usr/share/nginx/html/*
# WHY copy from build stage?
# - ONLY copies the dist/ folder (built files)
# - Discards Node.js, source code, node_modules
# - Massive size reduction
COPY --from=build /app/dist /usr/share/nginx/html
# WHY copy custom nginx config?
# - Need to configure SPA routing
# - Set up port 5009
# - Enable gzip compression
COPY nginx.conf /etc/nginx/conf.d/default.conf
# EXPOSE the port
EXPOSE 5009
# WHY this command?
# - Runs nginx in foreground (required for Docker)
# - "daemon off" prevents nginx from backgrounding itself
CMD ["nginx", "-g", "daemon off;"]