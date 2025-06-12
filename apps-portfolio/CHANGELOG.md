# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## [0.8.16] - 2025-06-12

### Fixed

- Docker build process to ensure database is populated during image creation.
- Frontend data loading by re-introducing `NEXT_PUBLIC_API_URL` for API calls and configuring `next.config.ts` for local image serving.
- `VERSION` file not being included in Docker image.

### Changed

- `entrypoint.sh` to include `show-db.ts` for debugging database content.
- `src/lib/db.ts` to use absolute path for SQLite database within Docker.
- `src/app/components/ListView.tsx`:
    - Display event type.
    - Format dates to "D MMM" for current year, "YYYY-MM-DD" otherwise.
    - Show "Title @ Event" with only title linked and event styled with gradient.
    - Replaced type column with emoji (🗣️ for talks, ✍️ for articles).
- `src/app/components/CalendarView.tsx` to apply consistent gradient styling to event names.
- `justfile`'s `docker-run-riccardo-test-8081` command to use current `VERSION` and `DEBUG='*'`. 

### Removed

- Redundant `scripts/setup-db.ts` file.
- Temporary `console.log` statements from API routes and frontend data fetching.

## [0.8.15] - 2025-06-12

### Changed

- Configured `next.config.ts` to include `localhost:8080` and `localhost:8081` in `remotePatterns` for local image serving.

## [0.8.14] - 2025-06-12

### Added

- Debugging `console.log` statements to API routes (`src/app/api/talks/route.ts` and `src/app/api/articles/route.ts`).

## [0.8.13] - 2025-06-12

### Changed

- `src/app/lib/data.ts` to remove `NEXT_PUBLIC_API_URL` and use relative paths for API calls.

## [0.8.12] - 2025-06-12

### Fixed

- `VERSION` file not being included in Docker image.

## [0.8.11] - 2025-06-12

### Changed

- `entrypoint.sh` to include `npx tsx scripts/show-db.ts` for debugging.

## [0.8.10] - 2025-06-12

### Changed

- `src/lib/db.ts` to use absolute path for SQLite database within Docker.

## [0.8.9] - 2025-06-12

### Added

- `scripts/setup-db.ts` to ensure database schema is created.

### Changed

- `entrypoint.sh` to call `setupDb()` before importing YAML data.

## [0.8.8] - 2025-06-12

### Changed

- Dockerfile to set `PORT` environment variable to 8080.

## [0.8.7] - 2025-06-12

### Fixed

- Dockerfile to run `npx tsx scripts/import-yaml.ts` during the build process to populate the database.

## [0.8.6] - 2025-06-12

### Added

- Display event name in Calendar view for talks.

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