#!/bin/sh
set -e

npx tsx scripts/import-yaml.ts
exec "$@"