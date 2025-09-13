# VibeCheck Justfile

import '~/git/gic/justfile.gemini_common'

# Default task to run the checks
default: list

# Set the shell to bash for all recipes
set shell := ["bash", "-c"]

# --- Development Tasks ---

# List available commands
list:
    @just -l

# Setup the virtual environment and install dependencies
setup:
    @echo "Setting up virtual environment..."
    cd vibecheck && uv venv
    cd vibecheck && uv sync
    @echo "✅ Done! Activate with 'source vibecheck/.venv/bin/activate'"

# Run the main application
run *ARGS:
    @echo "🚀 Running VibeCheck..."
    source vibecheck/.venv/bin/activate && python vibecheck/src/main.py {{ARGS}}

# --- Utility Tasks ---

# Clean up temporary files
clean:
    @echo "Cleaning up..."
    find . -type f -name '*.pyc' -delete
    find . -type d -name '__pycache__' -delete


login:
    gckloud auth login

install:
    npx https://github.com/google-gemini/gemini-cli#early-access

# on macOS, use the following command to run gemini-cli
#    /Users/ricc/.npm/_npx/c28e76e3615b8274/node_modules/gemini-cli/bundle/gemini.js --config /Users/ricc/.gemini/config.json
gemini-cli:
    gemini.js --config ~/.gemini/settings.json
