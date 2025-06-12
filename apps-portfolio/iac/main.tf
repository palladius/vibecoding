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
  build {
    step {
      name = "gcr.io/cloud-builders/docker"
      id   = "Build"
      dir  = "apps-portfolio"
      args = [
        "build",
        "-t",
        "europe-west1-docker.pkg.dev/$PROJECT_ID/cloud-run-source-deploy/portfolio-app:latest",
        "."
      ]
    }
    step {
      name = "gcr.io/cloud-builders/docker"
      id   = "Push"
      args = [
        "push",
        "europe-west1-docker.pkg.dev/$PROJECT_ID/cloud-run-source-deploy/portfolio-app:latest"
      ]
      wait_for = ["Build"]
    }
    step {
      name = "gcr.io/google.com/cloudsdktool/cloud-sdk"
      id   = "Deploy"
      entrypoint = "gcloud"
      args = [
        "run",
        "deploy",
        "portfolio-app",
        "--image=europe-west1-docker.pkg.dev/$PROJECT_ID/cloud-run-source-deploy/portfolio-app:latest",
        "--region=europe-west1",
        "--platform=managed",
        "--allow-unauthenticated",
        "--quiet"
      ]
      wait_for = ["Push"]
    }
    images = ["europe-west1-docker.pkg.dev/$PROJECT_ID/cloud-run-source-deploy/portfolio-app:latest"]
    timeout = "1200s"
  }

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
