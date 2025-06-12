#!/bin/bash

set -euo pipefail

# This script enables the necessary Google Cloud APIs for the portfolio-app.
# It's intended to be run once during the initial setup.

# Load environment variables from .env file
if [ -f .env ]; then
  # Created by Gemini. I would just do "source .env", not sure re difference.
  export $(cat .env | sed 's/#.*//g' | xargs)
fi

if [ -z "$GOOGLE_PROJECT_ID" ]; then
  echo "Error: GOOGLE_PROJECT_ID is not set. Please set it in your .env file."
  exit 1
fi

echo "Enabling Cloud Build API for project $GOOGLE_PROJECT_ID..."
gcloud services enable cloudbuild.googleapis.com --project=$GOOGLE_PROJECT_ID
