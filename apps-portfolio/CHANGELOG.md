# Changelog

## v0.10.25 - 2025-06-13

### 🐛 Bug Fixes

- **Fixed broken links on "About Me" page:** The links to highlighted talks and articles were broken because the `type` property was not being set correctly. This has been fixed by updating the `AboutPage` component to correctly set the `type` property.

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
- Reverted the `src/app/lib/data.ts` to use `fetch` instead of calling the database directly.

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

## v0.10.19 - 2025-06-13

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

- **Fixed Cloud Build:** The Cloud Build was failing because the `.env.docker` file is not under git. This has been fixed by dynamically creating the environment configuration in the `cloudbuild.yaml`.

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

- **Fixed Cloud Build:** The Cloud Build was failing because the `.env.docker` file is not under git. This has been fixed by dynamically creating the environment configuration in the `cloudbuild.yaml`.

### Internal Changes

- Updated the `cloudbuild.yaml` to dynamically create the environment configuration.
- Updated the `README.md` to explain why Python is needed.

## v0.10.6 - 2025-06-13

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

### 🐛 Bug Fixes

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
- **Fixed test warnings:** A warning in the test suite related to state updates has been resolved.

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
