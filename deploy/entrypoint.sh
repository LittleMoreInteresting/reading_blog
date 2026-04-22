#!/bin/sh
set -e

# Initialize SQLite database from seed if not exists
if [ ! -f /app/data/dev.db ]; then
    echo "[init] Database not found, seeding from template..."
    cp /app/seed.db /app/data/dev.db
    echo "[init] Database seeded."
fi

# Start the Next.js standalone server
exec node server.js
