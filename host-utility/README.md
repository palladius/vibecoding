# VibeCheck

A modular system health check and maintenance tool.

## Setup

This project uses `uv` for dependency management. If you don't have it installed, you can install it with:

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

Once `uv` is installed, you can create a virtual environment and install the dependencies:

```bash
uv venv
uv sync
```

## Usage

With the virtual environment activated (`source .venv/bin/activate`), you can run the application:

```bash
python host-utility/main.py
```

## Configuration

The application is configured through the `config.yaml` file. See the comments in the file for details on the available options.
