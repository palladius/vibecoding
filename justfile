

list:
    just -l

# runs gemini-cli
run:
    npx https://github.com/google-gemini/gemini-cli#early-access


check_install:
    #!/bin/bash
    if ! command -v gemini-cli &> /dev/null; then
        echo "gemini-cli is not installed. Please run 'just install' first."
        exit 1
    fi
    echo "♊️ gemini-cli is installed."
    echo "🔑 GEMINI_API_KEY: $GEMINI_API_KEY"
