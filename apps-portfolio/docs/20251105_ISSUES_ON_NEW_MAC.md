# 2025-11-05 Issues on New Mac Setup for apps-portfolio

This document outlines the issues encountered and their resolutions during the initial setup of the `apps-portfolio` project on a new macOS machine. The primary challenge revolved around `npm install` failures due to `node-gyp`'s dependency on a specific Python environment.

## Problem: `npm install` failure with `ModuleNotFoundError: No module named 'distutils'`

Upon attempting `npm install`, the process failed during the `node-gyp rebuild` step for `better-sqlite3`. The core error message was:

```
ModuleNotFoundError: No module named 'distutils'
```

This error indicated that `node-gyp` was attempting to use a Python version that no longer included the `distutils` module. The system's default Python (or the one `node-gyp` was finding) was Python 3.14.0, where `distutils` has been removed.

### Why Python is Needed

The `better-sqlite3` package, a dependency of this project, relies on `node-gyp` to compile native C++ addons. `node-gyp` itself depends on a Python installation to manage its build processes.

### Why Python 3.14 is Not Enough

Python versions 3.12 and above have removed the `distutils` module. `node-gyp` (specifically version 8.4.1, as seen in the logs) requires `distutils` for its operations. Therefore, using Python 3.14.0 or newer directly with this version of `node-gyp` will result in the `ModuleNotFoundError`.

## Troubleshooting Steps & Resolutions

1.  **Initial `npm install` failure:**
    *   Error: `ModuleNotFoundError: No module named 'distutils'` with Python 3.14.0.

2.  **Attempted `pyenv` installation and configuration:**
    *   Command: `pyenv install 3.10.13 && pyenv global 3.10.13 && npm config set python $(pyenv which python)`
    *   Result: Failed because `pyenv` was not installed.

3.  **Attempted `npm install` with `PYTHON=python3.9` environment variable:**
    *   Command: `PYTHON=python3.9 npm install`
    *   Result: Still failed, as `node-gyp` was still picking up Python 3.14.0, indicating the environment variable was not effectively overriding `node-gyp`'s Python discovery.

4.  **Consulted Stack Overflow:**
    *   Reference: `https://stackoverflow.com/questions/38058386/why-is-node-gyp-rebuild-failing-on-mac-osx-el-capitan`
    *   Key takeaway: `node-gyp` issues on macOS often relate to Xcode Command Line Tools and Python environment compatibility.

5.  **Reinstalled Xcode Command Line Tools:**
    *   Command: `sudo rm -rf /Library/Developer/CommandLineTools && xcode-select --install`
    *   Result: Command Line Tools reinstalled. This is a general good practice for `node-gyp` issues.

6.  **Cleared `npm` cache and `node_modules`:**
    *   Command: `rm -rf node_modules package-lock.json && npm cache clean --force`
    *   Result: Cleaned project state for a fresh install attempt.

7.  **Confirmed `python@3.9` installation:**
    *   Command: `brew install python@3.9`
    *   Result: `python@3.9` was already installed.

8.  **Attempted `npm config set python`:**
    *   Command: `PYTHON_PATH=$(brew --prefix python@3.9)/bin/python3.9 && npm config set python $PYTHON_PATH`
    *   Result: Failed with "npm error `python` is not a valid npm option", indicating this configuration method is deprecated or incorrect for current `npm` versions.

9.  **Successful `npm install` with `PYTHON` environment variable (expected):**
    *   Command: `PYTHON=$(brew --prefix python@3.9)/bin/python3.9 npm install`
    *   *Expected Result:* This command should successfully force `node-gyp` to use Python 3.9, which contains `distutils`, resolving the primary installation error.

## Current Status

The `npm install` command is still pending successful execution after the `xcode-select --reset` was cancelled. The next step is to re-attempt `sudo xcode-select --reset` and then `npm install` with the `PYTHON` environment variable set to `python3.9`'s path.
