#!/bin/sh
set -e

# Fix ownership of data directory (bind mount may have wrong host uid/gid)
chown nextjs:nodejs /app/data 2>/dev/null || true

# Initialize SQLite database if not exists
if [ ! -f /app/data/dev.db ]; then
    echo "[init] Database not found, initializing from schema..."
    # Run prisma db push as root (needs write access to /app/data),
    # then fix ownership so the app can access it as nextjs
    npx prisma db push --accept-data-loss --schema=/app/prisma/schema.prisma
    chown nextjs:nodejs /app/data/dev.db
    echo "[init] Database initialized."
fi

# Start the Next.js standalone server as non-root user
exec su-exec nextjs node server.js
