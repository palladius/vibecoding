#!/bin/sh
set -e

# Run database migrations
npx tsx scripts/import-yaml.ts

# Start the application
exec "$@"
