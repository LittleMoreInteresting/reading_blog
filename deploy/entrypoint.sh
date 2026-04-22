#!/bin/sh
set -e

# Fix ownership of data directory (bind mount may have wrong host uid/gid)
chown nextjs:nodejs /app/data 2>/dev/null || true

# Initialize SQLite database from seed if not exists
if [ ! -f /app/data/dev.db ]; then
    echo "[init] Database not found, seeding from template..."
    cp /app/seed.db /app/data/dev.db
    chown nextjs:nodejs /app/data/dev.db
    echo "[init] Database seeded."
fi

# Start the Next.js standalone server as non-root user
exec su-exec nextjs node server.js
