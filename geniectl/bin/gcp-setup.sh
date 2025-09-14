#!/bin/bash

#set -euo pipefail
. .env

function create_service_account() {
    gcloud iam service-accounts create geniectl-runner \
        --display-name="geniectl Runner"
}

function grant_iam_to_service_account() {
    gcloud projects add-iam-policy-binding $GOOGLE_CLOUD_PROJECT \
        --member="serviceAccount:geniectl-runner@$GOOGLE_CLOUD_PROJECT.iam.gserviceaccount.com" \
        --role="roles/aiplatform.user"
}

function create_service_account_key() {
    gcloud iam service-accounts keys create .service-account.json \
        --iam-account="geniectl-runner@$GOOGLE_CLOUD_PROJECT.iam.gserviceaccount.com"
}

function revoke_iam() {
    gcloud projects remove-iam-policy-binding $GOOGLE_CLOUD_PROJECT \
        --member="user:${CLOUD_IDENTITY}" \
        --role="roles/aiplatform.user"
}

function grant_iam() {
    gcloud projects add-iam-policy-binding $GOOGLE_CLOUD_PROJECT \
        --member="user:${CLOUD_IDENTITY}" \
        --role="roles/aiplatform.user"
}

case "$1" in
    create-service-account)
        create_service_account
        ;;
    grant-iam-to-service-account)
        grant_iam_to_service_account
        ;;
    create-service-account-key)
        create_service_account_key
        ;;
    revoke-iam)
        revoke_iam
        ;;
    grant-iam)
        grant_iam
        ;;
    *)
        echo "Usage: $0 {create-service-account|grant-iam-to-service-account|create-service-account-key|revoke-iam|grant-iam}"
        exit 1
esac
