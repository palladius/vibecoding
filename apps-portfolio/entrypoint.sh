#!/bin/sh
set -e

# Maybe echo some ENV variables for debugging
echo "Starting entrypoint script..."
echo "+ NODE_ENV: $NODE_ENV"
echo "+ NEXT_PUBLIC_API_URL: $NEXT_PUBLIC_API_URL"
echo "+ PORT: $PORT"

# Check if the database URL is set
# Run database migrations and show content
npx tsx scripts/import-yaml.ts
npx tsx scripts/show-db.ts

# Start the application
exec "$@"
