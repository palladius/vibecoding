terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = ">= 5.34.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

resource "google_cloudbuild_trigger" "default" {
  name        = "tf-portfolio-app-main"
  description = "[Created with 🌍 Terraform] Continuous integration for the main branch"
  filename    = "apps-portfolio/cloudbuild.yaml"

  github {
    owner = var.github_repository_owner
    name  = var.github_repository_name
    push {
      branch = "^main$"
    }
  }
}

# ==============================================================================
# Keyless GitHub Actions -> Cloud Build Auto-Deploy (Workload Identity Federation)
# ==============================================================================

resource "google_iam_workload_identity_pool" "github_pool" {
  workload_identity_pool_id = "tf-github-pool"
  display_name              = "GitHub Actions Pool (Terraform)"
  description               = "[Created with 🌍 Terraform] WIF Pool for GitHub Actions"
}

resource "google_iam_workload_identity_pool_provider" "github_provider" {
  workload_identity_pool_id          = google_iam_workload_identity_pool.github_pool.workload_identity_pool_id
  workload_identity_pool_provider_id = "tf-github-provider"
  display_name                       = "GitHub Actions OIDC Provider"
  description                        = "[Created with 🌍 Terraform] OIDC Provider for GitHub Actions"

  attribute_mapping = {
    "google.subject"             = "assertion.sub"
    "attribute.actor"            = "assertion.actor"
    "attribute.repository"       = "assertion.repository"
    "attribute.repository_owner" = "assertion.repository_owner"
  }

  attribute_condition = "assertion.repository_owner == '${var.github_repository_owner}'"

  oidc {
    issuer_uri = "https://token.actions.githubusercontent.com"
  }
}

resource "google_service_account" "gha_deployer" {
  account_id   = "tf-portfolio-gha-deployer"
  display_name = "tf-portfolio-gha-deployer"
  description  = "[Created with 🌍 Terraform] Keyless GitHub Actions SA to trigger Cloud Build for apps-portfolio"
}

locals {
  gha_deployer_roles = [
    "roles/cloudbuild.builds.editor",
    "roles/storage.admin",
    "roles/serviceusage.serviceUsageConsumer",
    "roles/viewer",
    "roles/iam.serviceAccountUser",
  ]
}

resource "google_project_iam_member" "gha_deployer_roles" {
  for_each = toset(local.gha_deployer_roles)
  project  = var.project_id
  role     = each.value
  member   = "serviceAccount:${google_service_account.gha_deployer.email}"
}

resource "google_service_account_iam_member" "gha_wif_binding" {
  service_account_id = google_service_account.gha_deployer.name
  role               = "roles/iam.workloadIdentityUser"
  member             = "principalSet://iam.googleapis.com/${google_iam_workload_identity_pool.github_pool.name}/attribute.repository/${var.github_repository_owner}/${var.github_repository_name}"
}

variable "project_id" {
  type        = string
  description = "The Google Cloud project ID."
}

variable "region" {
  type        = string
  description = "The Google Cloud region."
  default     = "us-central1"
}

variable "github_repository_owner" {
  type        = string
  description = "The owner of the GitHub repository."
}

variable "github_repository_name" {
  type        = string
  description = "The name of the GitHub repository."
}

output "workload_identity_provider" {
  description = "Full WIF provider resource name for google-github-actions/auth"
  value       = google_iam_workload_identity_pool_provider.github_provider.name
}

output "gha_deployer_service_account" {
  description = "Service Account email for google-github-actions/auth"
  value       = google_service_account.gha_deployer.email
}

