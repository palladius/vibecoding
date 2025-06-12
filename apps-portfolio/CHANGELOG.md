# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2025-06-12

### Added

- Footer with app name, version, and link to changelog.
- Dynamic HTML title with app name and version.

### Fixed

- Corrected the link to the CHANGELOG.md file in the footer.

## [0.2.0] - 2025-06-12

### Added

- Cloud Build pipeline for automated builds and deployments.
- Project-independent configuration for Cloud Build.
- Justfile commands for building and deploying the application.

### Changed

- Exposed port 8080 in the Dockerfile and updated the start script.
- Fixed import paths in ArticlesList and TalksList components.

## [0.1.0] - 2025-06-11

### Added

- Initial commit of the portfolio application.
- Basic Next.js setup with TypeScript and Tailwind CSS.
- Data import from YAML to SQLite.
- Display of talks and articles on the home page.
- Logging setup for development.
