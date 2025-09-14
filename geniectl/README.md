# Genie-CTL (`geniectl`)

Genie-CTL is a command-line tool that uses Kubernetes-like YAML manifests to declaratively define, generate, and manage complex multimedia assets. It orchestrates calls to various generative APIs, handles dependencies between assets, and ensures that generation is idempotent.

## Vision

The primary goal is to provide a reproducible and version-controllable way to create creative assets like storyboards, videos with soundtracks, illustrated articles, and more.

## Getting Started

See `PLAN.md` for the development roadmap.

To install dependencies:
```bash
just install
```

## Usage

```bash
genectl apply -f etc/sample_story.yaml
```

## Project Structure

```
geniectl/
├─── .gitignore
├─── AI_REASONING.md
├─── GEMINI.md
├─── justfile
├─── PLAN.md
├─── pyproject.toml
├─── README.md
├─── uv.lock
├─── etc/
│    └─── sample_story.yaml
├─── src/
│    └─── geniectl/
│         ├─── __init__.py
│         ├─── cli.py
│         ├─── engine.py
│         ├─── parser.py
│         └─── kinds/
│              ├─── base.py
│              ├─── image.py
│              ├─── text.py
│              └─── video.py
└─── tests/
     ├─── test_parser.py
     └─── test_engine.py
```

Library: https://pypi.org/project/geniectl/
