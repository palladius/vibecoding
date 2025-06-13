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
