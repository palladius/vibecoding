# VibeCheck

A modular system health check and maintenance tool.

## Setup

This project uses `uv` for dependency management and `just` as a command runner.

1.  **Install `uv` and `just`**:
    ```bash
    # Install uv
    curl -LsSf https://astral.sh/uv/install.sh | sh
    # Install just (macOS)
    brew install just
    ```

2.  **Setup the environment**:
    From this directory (`vibecheck`), run:
    ```bash
    just setup
    ```
    This will create a virtual environment and install all necessary dependencies.

## Usage

To run the application, simply use:
```bash
just run
```
Or, to be explicit:
```bash
just
```

## Configuration

The application is configured through the `config.yaml` file located in this directory. See the comments in the file for details on the available options.
