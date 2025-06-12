#!/bin/sh
set -e

# Run database migrations and show content
npx tsx scripts/import-yaml.ts
npx tsx scripts/show-db.ts

# Start the application
exec "$@"
