# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
