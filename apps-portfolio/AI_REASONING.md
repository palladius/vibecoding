
## Cloud Build Version Tagging Wisdom (2025-06-12)

Learned a crucial lesson regarding robust Docker image version tagging in Cloud Build, especially for GitHub-triggered builds.

**Problem:**
- Relying on Cloud Build's `substitutions` for custom variables (like `_VERSION`) and the `images` stanza for versioned tags is unreliable for automatic GitHub triggers.
- The `images` stanza primarily declares images built, not explicitly tags/pushes custom versioned tags based on dynamic `VERSION` files.

**Solution (Riccardo's Wisdom):**
- Implement version tagging and pushing directly within a dedicated `bash` step in `cloudbuild.yaml`.
- This step should be placed between the `Push` (of `latest`) and `Deploy` stages.
- **Key Commands:**
    - Read the `VERSION` file directly: `VERSION=$(cat VERSION)`
    - Tag the `latest` image with the version: `docker tag europe-west1-docker.pkg.dev/$PROJECT_ID/cloud-run-source-deploy/portfolio-app:latest europe-west1-docker.pkg.dev/$PROJECT_ID/cloud-run-source-deploy/portfolio-app:v$VERSION`
    - Push the versioned tag: `docker push europe-west1-docker.pkg.dev/$PROJECT_ID/cloud-run-source-deploy/portfolio-app:v$VERSION`
- This approach ensures:
    - Compatibility with GitHub triggers (no reliance on manual `--substitutions`).
    - Explicit control over tagging and pushing.
    - Both `latest` and `v<VERSION>` tags exist in Artifact Registry.
    - The actions are fast as they leverage the same underlying image layers (like creating a symlink).

**Note:** While ideally `v<VERSION>` would be created first and `latest` later, the current setup works with an existing `latest` image, and this order is acceptable for now.
