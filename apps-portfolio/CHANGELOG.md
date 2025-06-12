# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## [0.8.20] - 2025-06-12

### Fixed (BUG 🐛)

- **Empty UI on Cloud Run/Docker:** Resolved the critical issue where the UI displayed zero talks/articles.
    - **Root Cause:** The frontend was incorrectly configured to use `NEXT_PUBLIC_API_URL` for API calls, which is inlined at build time and was not correctly set in the Docker build environment.
    - **Solution:** Reverted `src/app/lib/data.ts` to use **relative paths** (e.g., `/api/talks`) for all API calls, aligning with the project's intended client-side fetching strategy.
    - **Reverted:** Removed `NEXT_PUBLIC_API_URL` environment variable from `cloudbuild.yaml` (`--set-env-vars`) and `justfile` (`docker-run-riccardo-test-8081` command) as it was causing misconfiguration.
- **Dockerfile Path in Cloud Build:** Corrected the `lstat /workspace/apps-portfolio/Dockerfile: no such file or directory` error.
    - **Solution:** Removed `dir: 'apps-portfolio'` from the `Build` step in `cloudbuild.yaml`.
- **Image Loading on Cloud Run:** Ensured images load correctly in deployed environments.
    - **Solution:** Added the Cloud Run application URL (`https://portfolio-app-272932496670.europe-west1.run.app`) to `next.config.ts` `images.remotePatterns`.
- **`VERSION` file not included in Docker:** Ensured the application version is available in the Docker image.
    - **Solution:** Added `COPY --from=build /app/VERSION ./VERSION` to `Dockerfile`.

### Changed

- **UI Enhancements (List View):**
    - Displays event type.
    - Formats dates to "D MMM" for current year, "YYYY-MM-DD" otherwise.
    - Shows "Title @ Event" with only title linked and event styled with a bold, gradient text (with unstyled '@').
    - Replaced type column with emoji (🗣️ for talks, ✍️ for articles).
- **UI Enhancements (Calendar View):**
    - Applied consistent gradient styling to event names.
- **Debugging Additions (and subsequent removal/reversion):**
    - Added `echo` statements to `entrypoint.sh` for environment variables.
    - `justfile`'s `docker-run-riccardo-test-8081` command updated to use current `VERSION` and `DEBUG='*'`.
- **Database Path in Docker:** `src/lib/db.ts` to use absolute path for SQLite database within Docker.

### Removed

- Redundant `scripts/setup-db.ts` file.
- `type: workshop` field from `etc/data.yaml`.
- Temporary `console.log` statements from API routes and frontend data fetching (as part of `src/app/lib/data.ts` reversion).


## [0.8.19] - 2025-06-12

### Fixed

- Cloud Run deployment by ensuring `NEXT_PUBLIC_API_URL` is correctly set via `cloudbuild.yaml`.
- Docker build process by restoring `dir: 'apps-portfolio'` in `cloudbuild.yaml`.
- Frontend data loading by reverting `src/app/lib/data.ts` to use `process.env.NEXT_PUBLIC_API_URL` for API calls.
- Image loading in both local and remote environments by configuring `next.config.ts` to include `localhost:8080`, `localhost:8081`, and the Cloud Run URL in `images.remotePatterns`.
- `VERSION` file not being included in Docker image.

### Added

- Debugging `echo` statements to `entrypoint.sh` for environment variables.
- Debugging `console.log` statements to API routes (`src/app/api/talks/route.ts` and `src/app/api/articles/route.ts`).
- Debugging `console.log` to `src/app/page.tsx` to trace items in state.
- `justfile`'s `docker-run-riccardo-test-8081` command updated to use current `VERSION` and `DEBUG='*'`. 

### Changed

- `src/app/components/ListView.tsx`:
    - Displays event type.
    - Format dates to "D MMM" for current year, "YYYY-MM-DD" otherwise.
    - Show "Title @ Event" with only title linked and event styled with a bold, gradient text (with unstyled '@').
    - Replaced type column with emoji (🗣️ for talks, ✍️ for articles).
- `src/app/components/CalendarView.tsx` to apply consistent gradient styling to event names.
- `src/lib/db.ts` to use absolute path for SQLite database within Docker.

### Removed

- Redundant `scripts/setup-db.ts` file.
- `type: workshop` field from `etc/data.yaml`.
- Temporary `console.log` statements from API routes and frontend data fetching (as part of `src/app/lib/data.ts` reversion).


## [0.8.5] - 2025-06-12

fix: Resolve ERR_MODULE_NOT_FOUND in Docker build

- Explicitly copied src/lib to the production stage in Dockerfile.
- Updated import path in scripts/import-yaml.ts to correctly reference .ts file."


## [0.8.4] - 2025-06-12

### Changed

- Enhanced Calendar View with event emoji, Day of Week, and linked titles.

## [0.8.3] - 2025-06-12

### Changed

- Replaced "Status:" text with emojis in talk pages and talk cards for a more concise UI.

## [0.8.2] - 2025-06-12

### Added

- `just db-show` command to display database content for troubleshooting.

### Fixed

- Import script (`scripts/import-yaml.ts`) to handle empty or non-array `tags` fields and provide better error reporting.

## [0.8.1] - 2025-06-12

### Added

- "Next Talks" page with card and calendar views for future talks.

### Fixed

- Linting errors related to `any` types in `src/app/lib/data.ts` and `src/app/page.tsx`.
- Test failure in `src/app/page.test.tsx` by correctly asserting the presence of the `ItemsList` component.

## [0.8.0] - 2025-06-12

### Added

- Resource type and emoji to talk and article pages.
- Images to talk and article pages.
- Clickable resource links to talk pages.

### Changed

- Header is now leaner with a black background and yellow text.
- Main background is now a darker shade.
- Article and Talk cards now have a dark theme.
- Images on talk and article pages are now larger.

### Fixed

- Corrected the CHANGELOG link in the footer.
- Fixed an issue where the date was not displaying for talks.
- Fixed an issue where talks were not generating permalinks correctly.
- Correctly ignored environment files in `.gitignore`.
- Removed `.env2` from git history.

## [0.7.1] - 2025-06-12

1. Riccardo: committed plenty of stuff including AboutMe.

## [0.7.0] - 2025-06-12

### Added

- "About Me" page with bio and highlighted talks and articles.
- Unified `ItemsList` component for talks and articles.
- API endpoints for highlighted items.

### Changed

- Main page now displays both talks and articles.
- Dockerfile now uses a multi-stage build.

### Fixed

- Database schema and import script to support images for talks and articles.

## [0.5.1] - 2025-06-12

### Fix

- **tests**: make tests non-blocking and fast

## [0.5.0] - 2025-06-12

### Fixed

- Image layout in cards.

## [0.4.0] - 2025-06-12

### Added

- Card view for talks and articles.
- Permalink for card view at `/cards`.
- Country flags to talk cards.
- Images to talks and articles.

### Fixed

- Database access logic by using `better-sqlite3` and API routes.
- Image layout in cards.

## [0.3.0] - 2025-06-12

### Added

- Initial version of the portfolio.
- Talks and articles lists.
- Database setup with `sqlite3`.
- YAML import script.
- Basic styling with Tailwind CSS.
