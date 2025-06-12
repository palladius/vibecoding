# Current UI Empty Bug - Potential Causes (Post 18:25 Changes)

This document outlines significant code changes introduced after approximately 18:25 on June 12, 2025, that might be contributing to the UI displaying zero talks/articles, despite the API endpoints returning data.

## Identified Big Changes:

1.  **`Dockerfile` - `NEXT_PUBLIC_API_URL` Handling:**
    *   **Change:** Removal of `ARG NEXT_PUBLIC_API_URL` and `ENV NEXT_PUBLIC_API_URL` from the build stage.
    *   **Potential Impact:** Next.js client-side environment variables (those prefixed with `NEXT_PUBLIC_`) are inlined into the JavaScript bundle at *build time*. If `NEXT_PUBLIC_API_URL` is not available during the `npm run build` step inside the Dockerfile, the frontend's `fetch` calls will use an incorrect or `undefined` URL, leading to data not being displayed.

2.  **`cloudbuild.yaml` - `NEXT_PUBLIC_API_URL` Setting:**
    *   **Change:** Addition of `--set-env-vars=NEXT_PUBLIC_API_URL=...` to the `gcloud run deploy` command.
    *   **Potential Impact:** This sets the environment variable for the *running container*, but it does *not* affect the build-time environment where the Next.js frontend bundle is created. This reinforces the issue described in point 1.

3.  **`src/app/lib/data.ts` - `NEXT_PUBLIC_API_URL` Usage:**
    *   **Change:** Reversion of API calls to explicitly use `${process.env.NEXT_PUBLIC_API_URL}/api/...` instead of relative paths.
    *   **Potential Impact:** While this is the correct way to use `NEXT_PUBLIC_API_URL` for client-side fetching, it makes the frontend entirely dependent on this variable being correctly set *at build time*. If it's `undefined` during the Docker build, the URLs will be malformed (e.g., `undefined/api/talks`).

4.  **`cloudbuild.yaml` - `dir: 'apps-portfolio'` Removal:**
    *   **Change:** Removed `dir: 'apps-portfolio'` from the `Build` step.
    *   **Potential Impact:** This was a fix for Cloud Build not finding the Dockerfile. While necessary, it's a change in the build context handling that could interact with other environment variable issues.

5.  **`etc/data.yaml` - `type: workshop` Addition/Removal:**
    *   **Change:** Addition and subsequent removal of `type: workshop` for a talk entry.
    *   **Potential Impact:** Less likely to cause a complete UI empty state, but schema changes can sometimes lead to parsing errors if not handled gracefully by the frontend. (This was already reverted by user).

## Hypothesis:

The primary cause of the empty UI is that the `NEXT_PUBLIC_API_URL` environment variable is not being correctly passed to the Next.js build process *inside the Docker container*. As a result, the client-side JavaScript bundle is compiled with incorrect or missing API URLs, causing `fetch` calls to fail when the application runs.

## Proposed Solution:

1.  **Reintroduce `NEXT_PUBLIC_API_URL` as a build argument in `Dockerfile`:** This ensures Next.js correctly inlines the API URL into the client-side bundle.
2.  **Pass `NEXT_PUBLIC_API_URL` to `docker build` command in `cloudbuild.yaml`:** This will pass the Cloud Run URL to the Docker build process.
3.  **Update `justfile`'s `docker-build` to pass `NEXT_PUBLIC_API_URL` as a build arg for local testing.**
