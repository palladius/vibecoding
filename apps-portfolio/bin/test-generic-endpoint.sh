#!/bin/bash

# A script to test the generic endpoints of the portfolio app.
# This is to make sure the app is running correctly.

set -euo pipefail

BASE_URL="${1:-http://localhost:3002}"

echo "⚪️ Testing base URL: $BASE_URL"
if ! curl -fL --connect-timeout 5 "$BASE_URL" > /dev/null; then
  echo "🔴 ERROR: Base URL failed to respond."
  exit 1
fi
echo "🟢 OK"

for endpoint in talks articles about next-talks; do
    echo "⚪️ Testing /$endpoint"
    if ! curl -fL --connect-timeout 5 "$BASE_URL/$endpoint" > /dev/null; then
        echo "🔴 ERROR: /$endpoint failed"
        exit 1
    fi
    echo "🟢 OK"
done


echo "⚪️ Testing a specific talk"
if ! curl -fL --connect-timeout 5 "$BASE_URL/talks/2025-10-14-agents-on-a-plane-a-deep-dive-into-building-a-real-time-travel-agent" > /dev/null; then
    echo "🔴 ERROR: specific talk failed"
    exit 1
fi
echo "🟢 OK"

echo "⚪️ Testing a specific article"
if ! curl -fL --connect-timeout 5 "$BASE_URL/articles/2024-02-05-autotranslate-my-hugo-blog-with-gemini" > /dev/null; then
    echo "🔴 ERROR: specific article failed"
    exit 1
fi
echo "🟢 OK"

echo "✅ All endpoints are working correctly."
