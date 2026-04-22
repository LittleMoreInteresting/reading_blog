# syntax=docker/dockerfile:1

# ----------------------------------------
# Builder stage
# ----------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies needed for native modules (if any)
RUN apk add --no-cache libc6-compat

# Copy package files
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./

# Install dependencies (use npm; fallback if lockfile missing)
RUN \
  if [ -f pnpm-lock.yaml ]; then npm install -g pnpm && pnpm install --frozen-lockfile; \
  elif [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  else npm install; \
  fi

# Copy prisma schema first (for layer caching)
COPY prisma ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY . .

# Build Next.js standalone output
# Provide a temporary DATABASE_URL so SSG pages can prerender during build
ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL="file:/tmp/build.db"
RUN npx prisma db push --accept-data-loss
RUN npm run build

# Generate a seed database with schema (empty, no data)
ENV DATABASE_URL="file:/app/seed.db"
RUN npx prisma db push --accept-data-loss

# ----------------------------------------
# Runner stage
# ----------------------------------------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Install su-exec for dropping privileges in entrypoint
RUN apk add --no-cache su-exec

# Copy standalone output from builder
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy prisma files for runtime
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma

# Copy seed database for first-time initialization
COPY --from=builder --chown=nextjs:nodejs /app/seed.db ./seed.db

# Create data directory for SQLite (will be mounted as volume)
RUN mkdir -p /app/data && chown nextjs:nodejs /app/data

# Copy entrypoint script (run as root to fix bind-mount permissions)
COPY deploy/entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

ENTRYPOINT ["./entrypoint.sh"]
