# Genie-CTL (`geniectl`)

PyPI: https://pypi.org/project/geniectl/
Github:

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

Some examples:

```bash
genectl apply -f etc/sample_story.yaml
```

```bash
$ just plan # Executes a DRY RUN execution
$ just plan
uv run geniectl apply -f /Users/ricc/git/vibecoding/geniectl/etc/story-generation.yaml --plan
Applying from path: /Users/ricc/git/vibecoding/geniectl/etc/story-generation.yaml
--- Starting Engine: Building Dependency Graph ---
--- Saved dependency graph to out/dependencies.dot ---
--- Generated dependency graph PNG: out/dependencies.png ---

--- Execution Plan ---
🟢 ♊ TextGeneration/bedtime-story-text  ❌ 💾 bedtime-story-en.md (Ready to go)
🟡 ♊ TextGeneration/bedtime-story-text-it  -> depends on [TextGeneration/bedtime-story-text] ❌ 💾 bedtime-story-it.md (Unsatisfied dependency: TextGeneration/bedtime-story-text (output not found))
🟡 🐍 ImageGeneration/story-illustration (x4)  -> depends on [TextGeneration/bedtime-story-text] ❌ 💾 story-illustration_{0..3}.png (Unsatisfied dependency: TextGeneration/bedtime-story-text (output not found))
🟡 🐍 AudioGeneration/bedtime-story-audio-it  -> depends on [TextGeneration/bedtime-story-text-it] ❌ 💾 bedtime-story-it.wav (Unsatisfied dependency: TextGeneration/bedtime-story-text-it (output not found))
----------------------
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
