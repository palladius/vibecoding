# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2025-09-14

### ✨ Features

- **Enhanced Plan View**: The `geniectl apply --plan` output is now more informative and visually appealing.
  - Added emojis (✅, ❌, ⚠️) to indicate the existence of output files.
  - Color-codes filenames based on their status (blue for missing, green for existing, yellow for partial).
  - Color-codes the resource kind in cyan for better readability.
  - The plan now correctly displays multi-file outputs for resources with `replicas` (e.g., `image_{0..3}.png`).
- **Image Generation**: Added a draft handler for the `ImageGeneration` kind, including support for the `replicas` parameter.

### 🐛 Fixed

- Corrected a bug where the plan would not accurately reflect the existence of multiple output files (replicas).
- Improved dependency checking to be aware of multi-file outputs.

## [0.2.1] - 2025-09-14

### Added
- **Dry Run Option**: Added a `--plan` / `--dry-run` option to the `apply` command to show the execution plan without running it.



### Added
- **Dependency Graph Visualization**: The engine now generates a `.dot` file and a PNG image to visualize the dependency graph on every run.
- **Test Plan**: Created a high-level test plan in `doc/tests.md` to guide future development.
- **`just init` command**: Added a new `init` command to the `justfile` for easier project setup.

### Fixed
- **Execution Order**: Corrected the dependency resolution logic to ensure the execution plan is in the correct topological order.
- **Dependency Handling**: The `AudioGeneration` handler now correctly reads the output from its `TextGeneration` dependency, even if the text generation was skipped.
- **Configuration Loading**: The engine now correctly loads the `config.yaml` file from the project root.
- **`just test` command**: The `test` command in the `justfile` now correctly uses `uv run pytest`.
- **Syntax Errors**: Fixed various syntax and indentation errors in the codebase.

## [0.1.1] - 2025-09-14

### Added
- **Audio Handler**: Introduced a mock handler for the `AudioGeneration` kind.
- **Packaging**: Configured the project for publishing to PyPI with `build` and `twine`.
- **Documentation**: Created this `CHANGELOG.md` file.

### Fixed
- Resolved numerous pathing and execution issues related to the `justfile` and virtual environment.

## [0.1.0] - 2025-09-14

### Added
- **Initial Scaffolding**: Created the `geniectl` tool, a declarative engine for generating multimedia assets from YAML manifests.
- **Core Engine**: Implemented dependency resolution with a topological sort and a "PLAN" phase output.
- **CLI**: Built a command-line interface with `click` that accepts files or directories (`apply -f`).
- **Mock Handlers**: Added a mock generator for the `TextGeneration` kind.
