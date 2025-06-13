# Changelog

Major changes:

* 2025-06-13 - v`0.10`. We introduced Prisma ORM. Dont know why, ask Gemini.
* 2025-06-12 - v`0.9`. We fixed a BIG long regression bug due to API url and `NEXT_PUBLIC_API_URL`.

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
