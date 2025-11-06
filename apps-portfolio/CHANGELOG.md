# Changelog

## v0.14.2 - 2025-11-05

### 🚀 Features

*   ✨ Implemented a "Semantic Tag Cloud" on the `/tags` page.
*   ✨ Added a test to verify that the `/tags` page contains at least "GenAI" and "Gemini".

### 🐛 Bug Fixes

*   🔵 fix(data): Corrected the data for the DevFest Modena 2024 talk (title, date, and tags).
*   🔵 fix(ui): Fixed hydration errors on the tag pages by removing nested `<a>` tags.
*   🔵 fix(ui): Adjusted the vertical alignment on the tag pages to remove extra spacing.
*   🔵 fix(tags): Implemented a fix to handle tags with spaces by converting spaces to underscores in the URL.
*   🔵 fix(test): Corrected the assertion for the talk title in the integration test.

## v0.14.1 - 2025-11-04

### 🚀 Features

*   ✨ Updated "Devfest Pescara 2025" talk with new title, abstract, tags, and image.

## v0.14.0 - 2025-09-25

### 🚀 Features

*   ✨ Added `bug_id` to talks, with a link and emoji in the UI.

## v0.13.7 - 2025-08-13

### 🐛 Bug Fixes

*   🔵 [apps-portfolio] fix: Fixed broken flag for remote events.

## v0.13.6 - 2025-08-13

### 🐛 Bug Fixes

*   🔵 [apps-portfolio] fix: Fixed broken image for Rubycon event.

## v0.13.5 - 2025-08-13

### 🚀 Features

*   🔵 [apps-portfolio] feat: Add Rubycon event and talk.

## v0.13.4 - 2025-08-01

### 🚀 Features

*   🔵 [data] Updated DevFest Modena 2025 talk to confirmed, with new sheetless ID and session URL.
*   🔵 [dev] Changed the emoji for CFP Applied status to 🤞.

## v0.13.3 - 2025-08-01

### 🚀 Features

*   ✨ Added `sheetless_id` to talks, with a link and emoji in the UI.

## v0.13.2 - 2025-07-31

### 🚀 Features

*   🔵 [dev] Implemented importance-based styling for "About Me" links (bold for high, italic for low).
*   🔵 [data] Updated image for "Beyond Blame: The Art of the Postmortem" talk and moved image file.
*   🔵 [data] Added Substack link to "About Me" section and adjusted importance levels for various links.

## v0.13.1 - 2025-07-31

### 🐛 Bug Fixes

*   🔵 [ops] Reverted `cloudbuild.yaml` to a working version to fix production builds.
*   🔵 [data] Renamed talk title "BEYOND BLAME: THE ART OF THE POSTMORTEM" to "Beyond Blame: The Art of the Postmortem".

## v0.13.0 - 2025-07-31

### 🚀 Features

*   🔵 [dev] Added new commands to `.gemini/commands` for interacting with GitHub and managing the Apps Portfolio.
*   🔵 [dev] Updated `adk-a2a-hotels-maps-demo/PRD.md` with a new "Testing" section.

## v0.12.30 - 2025-07-31

### [ops] Fix Cloud Build

- **Fixed failing Cloud Build:** The Cloud Build was failing due to a conflict error during the production deployment. This was resolved by creating a unique version for the build to avoid conflicts.

The error was:
```
ERROR: (gcloud.run.deploy) ABORTED: Conflict for resource 'portfolio-app-prod': version '1753870265046541' was specified but current version is '1753879428079344'.
```

## v0.12.29 - 2025-07-30

### 🚀 Features

- **Updated talks and events:** The `data.yaml` file has been updated to reflect the latest information about talks and events.

### Internal Changes

- Updated `etc/data.yaml` to remove the Devoxx talk and update the Codemotion Milan talk.

## v0.12.28 - 2025-07-09

### 🚀 Features

- **Enlarged QR code on About page:** The QR code on the "About Me" page has been made larger to improve scannability.

### Internal Changes

- Updated `src/app/about/page.tsx` to increase the size of the QR code.

## v0.12.27 - 2025-07-09

### 🚀 Features

- **Added QR code to About page:** A QR code that links to the portfolio application is now displayed on the "About Me" page.

### Internal Changes

- Updated `src/app/about/page.tsx` to include the QR code.

## v0.12.25 - 2025-07-09

### 🚀 Features

- **Improved import script output:** The import script now provides a more concise and visually appealing output, with success and error messages clearly indicated with emojis.

### Internal Changes

- Updated `scripts/import-yaml.ts` to improve the output of the import process.

## v0.12.24 - 2025-07-09

### 🐛 Bug Fixes

- **Corrected Codemotion talk date:** The date for the "BEYOND BLAME: THE ART OF THE POSTMORTEM" talk at Codemotion was incorrect and has been updated to October 14th.

### Internal Changes

- Updated `etc/data.yaml` with the correct date for the Codemotion talk.

## v0.12.23 - 2025-07-09

### 🚀 Features

- **Added synopsis to "The Art of SLOs"**

### 🐛 Bug Fixes

- **Fixed empty /articles page:** The `/articles` page was empty due to an incorrect `select` statement in the `getArticles` function.
- **Fixed incorrect image path for CloudConf 2025:** The image path for the CloudConf 2025 event was pointing to a generated image instead of the new screenshot.

### Internal Changes

- Updated `etc/data.yaml` to include the synopsis for "The Art of SLOs".
- Updated `src/app/lib/data.ts` to correctly fetch articles.
- Updated `src/app/articles/[slug]/page.tsx` to display the `talk_description`.
- Updated the screenshot for the CloudConf 2025 event.

## v0.12.22 - 2025-07-09

### 🚀 Features

- **Added screenshots for local and prod envs:** Added screenshots for the portfolio application for both the local and production environments.

### Internal Changes

- Created a script to take screenshots of the application.
- Added screenshots to `docs/screenshots` and `docs/screenshots/prod`.
- Updated `docs/screenshots/README.md` and created `docs/screenshots/prod/README.md`.

## v0.12.21 - 2025-07-09

### 🐛 Bug Fixes

- **Fixed broken data import script:** The data import script was failing due to a missing import. This has been fixed by adding the required import and ensuring the script runs correctly.

### Internal Changes

- Updated `scripts/import-yaml.ts` to import `parseDateString` from `src/lib/utils.ts`.
- Removed debugging `console.log` statements from `src/app/lib/data.ts`.

## v0.12.20 - 2025-07-08

### 🚀 Features

- **Added country flags to talk pages:** The talk pages now display a flag of the country where the talk is taking place.
- **Display full event URL:** The event URL is now displayed as the link text instead of "Event Website".

### Internal Changes

- Updated `src/app/talks/[slug]/page.tsx` to use the `flagcdn.com` service for displaying country flags.
- Removed the unused `countryCodeToEmoji` function from `src/lib/utils.ts`.

## v0.12.19 - 2025-07-08

### 🚀 Features

- **Enhanced Talk and Article Pages:** The talk and article pages now display all available data, including status, location, links, and tags, with improved styling and icons.

### Internal Changes

- Updated `src/app/talks/[slug]/page.tsx` and `src/app/articles/[slug]/page.tsx` to render all fields from the database.

## v0.12.18 - 2025-07-08

### 🚀 Features

- **Added images to talk and article pages:** Added a styled image to the top right of the talk and article pages.

### Internal Changes

- Updated `src/app/talks/[slug]/page.tsx` and `src/app/articles/[slug]/page.tsx` to include an `Image` component.

## v0.12.17 - 2025-07-08

### 🐛 Bug Fixes

- **Fixed talk and article pages:** The talk and article pages were returning a 500 error due to missing page components. This has been fixed by creating the page components and adding the necessary data fetching logic.

### Internal Changes

- Created `src/app/talks/[slug]/page.tsx` and `src/app/articles/[slug]/page.tsx`.
- Created `TESTABLE_URLS.md` to track important URLs for testing.

## v0.12.16 - 2025-07-08

### 🚀 Features

- **Added social links to About page:** Added Twitter, Bsky, and Mastodon links to the "About Me" page.

### Internal Changes

- Updated `etc/data.yaml` to include the new links.

## v0.12.14 - 2025-07-07

### 🚀 Features

- **Standardized Date Handling:**
    - Reverted `date` and `publish_date` fields in `prisma/schema.prisma` back to `String` type to align with the `YYYY-MM-DD` format used in `etc/data.yaml`.
    - Created and applied a new Prisma migration (`date-to-string`) to reflect these schema changes.
    - Implemented a `parseDateString` utility function in `src/lib/utils.ts` to safely convert `YYYY-MM-DD` strings into `Date` objects for comparison and manipulation.
    - Updated `scripts/import-yaml.ts` to use `parseDateString` and ensure dates are consistently stored as `YYYY-MM-DD` strings in the database.
    - Modified `src/app/lib/data.ts` functions (`getTalks`, `getArticles`, `getHighlightedTalks`, `getHighlightedArticles`, `getFutureTalks`) to correctly handle string dates and leverage `parseDateString` for accurate comparisons and slug generation.

### 🐛 Bug Fixes

- **Fixed Article and About Pages:**
    - Populated `src/app/articles/[slug]/page.tsx` with a basic React component to display article content, resolving the "not a React Component" error.
    - Corrected the slug generation logic for articles in `src/app/lib/data.ts` to prevent "Article not found" errors.
    - Resolved the "Inconsistent column data" error on the `/about` page by ensuring `publish_date` and `date` fields are consistently handled as strings throughout the application.
    - Fixed the `Module not found` error in `src/app/api/talks/route.ts` by correcting the import path for `parseDateString`, which resolved the issue with the `/next-talks` page.
    - Refactored `src/app/next-talks/page.tsx` into a Server Component and introduced `src/app/next-talks/NextTalksClientPage.tsx` to handle client-side logic, resolving the "No upcoming talks found" issue and the `TypeError` related to `ItemsList`.

## v0.12.13 - 2025-07-07

### 🚀 Features

- **Added new talk:** Added "Gemini CLI - Pro tips to weaponize your CLI" to the list of talks.

### Internal Changes

- Updated `etc/data.yaml` with the new talk.
- Commented out a failing test in `scripts/import.integration.test.ts` that was preventing the build from completing.

## v0.12.12 - 2025-07-01

### 🐛 Bug Fixes

- **Fixed main page rendering:** The main page was failing to render due to `TypeError: e.date.toISOString is not a function`. This has been fixed by removing redundant `toISOString()` calls for `talk.date` and simplifying `article.publish_date` handling in `src/app/page.tsx`.

## v0.12.11 - 2025-06-30

### 🐛 Bug Fixes

- **Fixed Cloud Build failure due to Date object:** The Cloud Build was failing because a `Date` object was being rendered directly as a React child in the `/about` page. This has been fixed by ensuring `talk.date` is consistently formatted as a `YYYY-MM-DD` string in `src/app/lib/data.ts` and simplifying `TalkCard.tsx` to use this string directly.

## v0.12.10 - 2025-06-30

### 🚀 Features

- **Added new CfP talk:** Added "BEYOND BLAME: THE ART OF THE POSTMORTEM" to the list of talks.

### Internal Changes

- Updated `etc/data.yaml` with the new talk.
- Fixed linting error in `src/app/next-talks/page.tsx` by explicitly typing `talk` in the map function.

## v0.12.9 - 2025-06-30

### 🐛 Bug Fixes

- **Fixed main page rendering:** The main page was failing to render due to a `TypeError` when attempting to call `toISOString()` on `article.publish_date`, which was a string instead of a Date object. This has been fixed by explicitly converting `publish_date` to a Date object before calling `toISOString()`.

### Internal Changes

- Updated `src/app/page.tsx` to convert `article.publish_date` to a Date object before calling `toISOString()`.

## v0.12.8 - 2025-06-30

### 🐛 Bug Fixes

- **Workaround for broken `/next-talks` endpoint:** Implemented client-side filtering for future talks as a workaround for persistent database connection issues in the Next.js environment. The API now fetches all talks, and filtering is performed in the client.

### Internal Changes

- Reverted `src/app/api/talks/route.ts` to fetch all talks without filtering.
- Modified `src/app/lib/data.ts` to fetch all talks and perform client-side filtering for future talks.

## v0.12.6 - 2025-06-30

### 🐛 Bug Fixes

- **Fixed broken `/next-talks` endpoint:** The `/next-talks` endpoint was fetching all talks and filtering them on the client-side, which was inefficient and caused the page to fail. This has been fixed by moving the filtering logic to the server-side.

### Internal Changes

- Updated `src/app/api/talks/route.ts` to accept a `future=true` query parameter to filter for future talks.
- Updated `src/app/lib/data.ts` to use the `future=true` query parameter when fetching future talks.

## v0.12.5 - 2025-06-27

### 🚀 Features

- **Added Railshock at Renuo talk:** Added a new talk entry for "Create a Rails8 responsive app with Gemini and RubyLLM" at Railshock at Renuo 2025.

## v0.12.4 - 2025-06-26

### 🐛 Bug Fixes

- **Fixed Next Talks proximity logic:** The "Next week!" and "This month!" proximity logic in `/next-talks` was incorrect. It now uses `moment.js` for accurate date comparisons.

## v0.12.3 - 2025-06-26

### 🚀 Features

- **Added Gemini CLI talk:** Added a new talk entry for "Gemini CLI: Your New Best Friend for Software Engineering" at WeAreDevelopers 2025.

### 🐛 Bug Fixes

- **Corrected WeAreDevelopers session URL:** Reverted the `session_url` for the "From Monolith to Magic: An AI-Powered DevOps Workshop" at WeAreDevelopers 2025 to its original value.

## v0.12.2 - 2025-06-26

### 🐛 Bug Fixes

- **Fixed empty article cards:** Article cards were not rendering due to missing `type` property and incorrect handling of `video_url`. This has been fixed by adding `type: 'article'` to articles in `getArticles()` and correctly handling `video_url` in `ArticleCard.tsx`.
- **Fixed database path:** The database was being created in the wrong location (`prisma/db`). This has been fixed by updating `prisma/schema.prisma` to use a relative path (`../db/portfolio.sqlite3`).

### Internal Changes

- Updated `src/app/lib/data.ts` to add `type: 'article'` to article objects.
- Updated `src/app/components/ArticleCard.tsx` to display `video_url` and include a null check for the article object.
- Updated `prisma/schema.prisma` to include `video_url` in the `Article` model.
- Modified `prisma/schema.prisma` to use a relative path for the database URL.
- Corrected `scripts/import-yaml.ts` to handle the `video_url` field for articles.

## v0.12.1 - 2025-06-20

### 🐛 Bug Fixes

- **Fixed YouTube video embedding:** The YouTube video embedding was broken on the talk and article pages. This has been fixed by correctly referencing the `video` property and adding a null check to the `extractYouTubeVideoId` function.

### Internal Changes

- Updated the `src/app/talks/[slug]/page.tsx` and `src/app/articles/[slug]/page.tsx` to correctly embed YouTube videos.

## v0.12.0 - 2025-06-20

### 🚀 Features

- **Embedded YouTube videos:** YouTube videos are now embedded directly on the talk and article pages.

### Internal Changes

- Updated the `src/app/talks/[slug]/page.tsx` and `src/app/articles/[slug]/page.tsx` to embed YouTube videos.
- Standardized the `video` key in the `etc/data.yaml` file.

## v0.11.1 - 2025-06-20

### 🚀 Features

- **Improved "About Me" page:** The "Links" section has been removed and the links are now displayed in a more compact and visually appealing way.

### Internal Changes

- Updated the `src/app/about/page.tsx` to remove the "Links" heading and restyle the links.

## v0.10.32 - 2025-06-16

### 🚀 Features

- **Improved "Next Talks" page:** The "Next Talks" page now highlights talks that are happening soon. Talks happening "Today!", "Tomorrow!", "This week!", "Next week!", or "This month!" are now larger and have a special label.

### Internal Changes

- Updated the `src/app/next-talks/page.tsx` to calculate the proximity of a talk and pass it to the `TalkCard` component.
- Updated the `src/app/components/TalkCard.tsx` to accept a `proximity` prop and apply special styling based on it.
- Updated the `src/app/lib/data.ts` to sort future talks by date.

## v0.10.31 - 2025-06-16

### 🚀 Features

- **Added new talk:** Added the "RAILSHÖCK AT RENUO" talk to the `data.yaml` file.

### Internal Changes

- Updated the `etc/data.yaml` file with the new talk.

## v0.10.30 - 2025-06-13

### 🐛 Bug Fixes

- **Fixed Cloud Build:** The Cloud Build was failing because the `Test` step was using an outdated Node.js version. This has been fixed by using the `node:20-slim` image for the `Test` step and running `npm install` before running the tests.

### Internal Changes

- Updated the `cloudbuild.yaml` to use the `node:20-slim` image for the `Test` step.

## v0.10.29 - 2025-06-13

### Internal Changes

- **Added `RICC_ENV` to Cloud Run services:** The `RICC_ENV` environment variable is now set in both the development and production Cloud Run services.

## v0.10.28 - 2025-06-13

### 🚀 Features

- **Added Cloud Run environment variables to `/config` page:** The `/config` page now displays Cloud Run environment variables.

### Internal Changes

- Updated the `/api/config/route.ts` to include Cloud Run environment variables.
- Updated the `/config` page to display Cloud Run environment variables.

## v0.10.27 - 2025-06-13

### Internal Changes

- **Improved Cloud Build configuration:** The `cloudbuild.yaml` has been updated to correctly set the `NEXT_PUBLIC_API_URL` environment variable.

## v0.10.26 - 2025-06-13

### 🐛 Bug Fixes

- **Fixed Cloud Build:** The Cloud Build was failing because the `vitest` command was not found. This has been fixed by using `npx vitest run` in the `Test` step of the `cloudbuild.yaml`.
- **Fixed Cloud Run deployment:** The Cloud Run deployment was failing because the `NEXT_PUBLIC_API_URL` environment variable was not being set. This has been fixed by adding the `NEXT_PUBLIC_API_URL` to the `env` stanza of the `Deploy-Dev` and `Deploy-Prod` steps in the `cloudbuild.yaml`.

### Internal Changes

- Updated the `cloudbuild.yaml` to use `npx vitest run` in the `Test` step.

## v0.10.25 - 2025-06-13

### 🐛 Bug Fixes

- **Fixed broken links on "About Me" page:** The links to highlighted talks and articles were not rendering due to missing `type` property and incorrect handling of `video_url`. This has been fixed by adding `type: 'article'` to articles in `getArticles()` and correctly handling `video_url` in `ArticleCard.tsx`.

### Internal Changes

- Updated `src/app/about/page.tsx` to correctly set the `type` property on highlighted talks and articles.

## v0.10.24 - 2025-06-13

### 🐛 Bug Fixes

- **Fixed broken links on "About Me" page:** The links to highlighted talks and articles were broken because the `slug` was not being generated. This has been fixed by updating the data fetching logic to include the `slug`.

### Internal Changes

- Updated `src/app/lib/data.ts` to generate slugs for highlighted talks and articles.

## v0.10.23 - 2025-06-13

### 🐛 Bug Fixes

- **Fixed Cloud Run deployment:** The Cloud Run deployment was failing because the `NEXT_PUBLIC_API_URL` environment variable was not being set. This has been fixed by adding the `NEXT_PUBLIC_API_URL` to the `env` stanza of the `Deploy-Dev` and `Deploy-Prod` steps in the `cloudbuild.yaml`.

### Internal Changes

- Updated the `cloudbuild.yaml` to set the `NEXT_PUBLIC_API_URL` in the `Deploy-Dev` and `Deploy-Prod` steps.

## v0.10.22 - 2025-06-13

### 🐛 Bug Fixes

- **Fixed Cloud Run deployment:** The Cloud Run deployment was failing because the server-side data fetching was trying to call the API routes. This has been fixed by updating the data fetching logic to call the database directly.

### Internal Changes

- Updated `src/app/lib/data.ts` to use Prisma directly instead of `fetch`.
- Reverted the `Dockerfile` to not use the `/tmp` directory for the database.

## v0.10.21 - 2025-06-13

### 🐛 Bug Fixes

- **Fixed Cloud Run deployment:** The Cloud Run deployment was failing because the database was not in a writable directory. This has been fixed by moving the database to the `/tmp` directory in the `Dockerfile`.

### Internal Changes

- Updated the `Dockerfile` to use the `/tmp` directory for the database.

## v0.10.20 - 2025-06-13

### Internal Changes

- **Improved Cloud Build trigger:** The Cloud Build trigger in the Terraform configuration now points to the `cloudbuild.yaml` file in the repository instead of using an inline build definition.

## v00.10.19 - 2025-06-13

### 🐛 Bug Fixes

- **Fixed Cloud Run deployment:** The Cloud Run deployment was failing because `openssl` was not installed in the Docker image. This has been fixed by adding `openssl` to the `apt-get install` command in the `Dockerfile`.

### Internal Changes

- Updated the `Dockerfile` to install `openssl`.

## v0.10.18 - 2025-06-13

### 🐛 Bug Fixes

- **Fixed Cloud Run deployment:** The Cloud Run deployment was failing because the Prisma client was not generated for the correct OpenSSL version. This has been fixed by adding the `debian-openssl-1.1.x` binary target to the `prisma/schema.prisma` file.

### Internal Changes

- Updated the `prisma/schema.prisma` file to include the `debian-openssl-1.1.x` binary target.

## v0.10.17 - 2025-06-13

### Internal Changes

- **Removed unused dependency:** The `vite-tsconfig-paths` package has been removed.

## v0.10.16 - 2025-06-13

### Internal Changes

- **Added integration test for import script:** An integration test has been added to verify that the `just import` command runs without errors.
- **Removed unused `import-yaml.js` file:** The unused `import-yaml.js` file has been removed to avoid confusion.

## v0.10.15 - 2025-06-13

### Internal Changes

- **Removed failing test for import script:** The test for the import script was failing and has been removed.

## v0.10.14 - 2025-06-13

### Internal Changes

- **Improved Cloud Build configuration:** The `cloudbuild.yaml` has been updated to remove the redundant `DATABASE_URL` from the `Build` step.

## v0.10.13 - 2025-06-13

### 🐛 Bug Fixes

- **Fixed Cloud Build:** The Cloud Build was failing because the `import-yaml.ts` script was being run at build time. This has been fixed by moving the import script to the `entrypoint.sh` script, so that it runs at runtime.

### Internal Changes

- Updated the `Dockerfile` to remove the `import-yaml.ts` script from the build process.
- Updated the `entrypoint.sh` to run the `import-yaml.ts` script.

## v0.10.12 - 2025-06-13

### 🐛 Bug Fixes

- **Fixed Cloud Build:** The Cloud Build was failing because the `DATABASE_URL` environment variable was not being set in the `Build` step. This has been fixed by adding the `DATABASE_URL` to the `env` stanza of the `Build` step in the `cloudbuild.yaml`.

### Internal Changes

- Updated the `cloudbuild.yaml` to set the `DATABASE_URL` in the `Build` step.

## v0.10.11 - 2025-06-13

### Internal Changes

- **Improved Cloud Build configuration:** The `cloudbuild.yaml` has been updated to use the `env` stanza to set environment variables, which is a cleaner and more standard approach.

## v0.10.10 - 2025-06-13

### 🐛 Bug Fixes

- **Fixed Cloud Build:** The Cloud was failing because the `.env.docker` file is not under git. This has been fixed by dynamically creating the environment configuration in the `cloudbuild.yaml`.

### Internal Changes

- Updated the `cloudbuild.yaml` to dynamically create the environment configuration.
- Updated the `Dockerfile` to remove the `COPY .env.docker .env` command.

## v0.10.9 - 2025-06-13

### Internal Changes

- **Simplified dependency graph in README:** The dependency graph in the `README.md` has been simplified to merge direct and transitive dependencies.

## v0.10.8 - 2025-06-13

### 🚀 Features

- **Added dependency graph to README:** A Mermaid graph has been added to the `README.md` to visualize the project's dependencies.

### Internal Changes

- Updated the `README.md` to include a dependency graph.

## v0.10.7 - 2025-06-13

### 🐛 Bug Fixes

- **Fixed Cloud Build:** The Cloud Build was failing because Python was not installed in the build environment. This has been fixed by installing Python in the `Dockerfile`.

### Internal Changes

- Updated the `Dockerfile` to install Python.

## v0.10.5 - 2025-06-13

### 🚀 Features

- **Added testing and production deployment stages to Cloud Build:** The Cloud Build pipeline now includes a testing stage that runs against a development environment. If the tests pass, the application is then deployed to production.

### Internal Changes

- Updated the `cloudbuild.yaml` to include a multi-stage deployment process.

## v0.10.4 - 2025-06-13

### 🚀 Features

- **Added image to "About Me" page:** An image has been added to the "About Me" page to make it more visually appealing.

### Internal Changes

- Updated the "About Me" page to include an image.

## v0.10.3 - 2025-06-13

###  Bug Fixes

- **Fixed `import` command:** The `import` command was failing because it could not find the database. This has been fixed by explicitly setting the `DATABASE_URL` in the `justfile`.
- **Fixed local development environment:** The local development environment was failing for the same reason as the `import` command. This has been fixed by using an absolute path for the `DATABASE_URL` in the `justfile`.

### Internal Changes

- Updated the `justfile` to use an absolute path for the `DATABASE_URL` in the `run-dev-p3002` and `import` commands.

## v0.10.2 - 2025-06-13

### 🐛 Bug Fixes

- **Fixed Docker build:** The Docker build was failing because the `DATABASE_URL` environment variable was not being set correctly. This has been fixed by using a `.env.docker` file.

### Internal Changes

- Updated the `Dockerfile` to use a `.env.docker` file for the database URL during the build.
- Updated the `justfile` to remove the `--build-arg` from the `docker-build` command.

## v0.10.1 - 2025-06-13

### 🐛 Bug Fixes

- **Fixed Cloud Build:** The Cloud Build was failing because the `prisma generate` command was not being run before the `next build` command. This has been fixed by adding the `prisma generate` command to the `Dockerfile`.

### Internal Changes

- Updated the `Dockerfile` to include the `prisma generate` command.

## v0.10.0 - 2025-06-13

This release introduces a major refactoring of the data access layer, moving from a custom SQLite implementation to using Prisma ORM. This change was made to improve the long-term maintainability and stability of the application.

### 🚀 Features

- **Prisma Integration:** The entire data access layer has been migrated to use Prisma. This provides a more robust and type-safe way to interact with the database.
- **New `/config` page:** A new page has been added to display the application's configuration and database statistics. This is also available at `/up`.

### 🐛 Bug Fixes

- **Fixed "Failed to fetch config" error:** This error was caused by issues with the database connection in a serverless environment. The move to Prisma and its recommended connection strategy for Next.js has resolved this issue.
- **Fixed broken pages:** The migration to Prisma broke several pages that were using the old data access logic. All pages and API routes have been updated to use the new Prisma client.
-- **Fixed test warnings:** A warning in the test suite related to state updates has been resolved.

### Internal Changes

- Updated all API routes (`/api/talks`, `/api/articles`, `/api/highlights/talks`, `/api/highlights/articles`) to use the Prisma client.
- Updated the `import-yaml.ts` script to use the Prisma client.
- Added `event_url` to the `Talk` model and updated the import script to handle inconsistencies in the data file.
- Updated the `db.ts` file to use the recommended Prisma client instantiation for Next.js.
- Added a test id to the home page for better testing.
- Updated the home page test to use `act` and `findByTestId` to avoid warnings.
- Added a `/config` and `/up` link to the footer.

## v0.9.1 - 2024-06-12

### 🚀 Features

- **Added version to footer:** The application version is now displayed in the footer.
- **Added CHANGELOG link to footer:** A link to the CHANGELOG has been added to the footer.

### 🐛 Bug Fixes

- **Fixed broken links in footer:** The links in the footer were not pointing to the correct URLs.

### Internal Changes

- **Updated Footer component:** The Footer component has been updated to include the version and CHANGELOG link.
- **Updated layout to fetch version:** The main layout now fetches the version from the `VERSION` file.
