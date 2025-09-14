# KubeGen Project Plan

## 1. Vision & Goal

KubeGen is a command-line tool that uses Kubernetes-like YAML manifests to declaratively define, generate, and manage complex multimedia assets. It orchestrates calls to various generative APIs, handles dependencies between assets, and ensures that generation is idempotent.

The primary goal is to provide a reproducible and version-controllable way to create creative assets like storyboards, videos with soundtracks, illustrated articles, and more.

## 2. Core Concepts

- **Manifest:** A YAML file defining one or more resources to be generated.
- **Resource:** A single asset definition, similar to a Kubernetes resource. It has an `apiVersion`, `kind`, `metadata`, and `spec`.
- **Kind:** The type of the resource to be generated (e.g., `Image`, `Video`, `Text`).
- **Engine:** The core logic that parses manifests, resolves dependencies, and executes generation tasks.
- **Idempotency:** The engine will check for existing outputs and compare input hashes. If nothing has changed, no action will be taken.

## 3. Development Phases

### Phase 1: Core Engine & Scaffolding (No API calls)

- [x] **Project Setup:**
    - [x] Create project folder `kubegen`.
    - [x] Create initial `PLAN.md`, `README.md`, `GEMINI.md`.
    - [x] Create `etc/sample_story.yaml`.
    - [x] Set up `justfile` for common commands.
    - [x] Initialize a Python project with `uv`.
- [ ] **YAML Specification (v1alpha1):**
    - [ ] Finalize the structure for `apiVersion`, `kind`, `metadata`, `spec`, and `status`.
    - [ ] Define the `spec` for initial kinds: `Text`, `Image`, `Audio`, `Video`.
- [ ] **Core Engine Implementation:**
    - [ ] Implement YAML manifest parser.
    - [ ] Build a dependency graph from the manifests.
    - [ ] Create a simple task runner to process the graph.
    - [ ] Implement a hashing mechanism for the `spec` of each resource to detect changes.
    - [ ] Implement mock "generator" functions for each `Kind` that create placeholder output files.
    - [ ] Implement logic to update the manifest (or a `.hydrated.yaml` file) with output status and file paths.
- [x] **CLI:**
    - [x] Create a basic CLI using `click`.
    - [x] Implement `geniectl apply -f <file_or_directory>` to run the generation process.

### Phase 2: API Integration

- [ ] Integrate with Google Cloud generative APIs (e.g., Vertex AI with Gemini, Imagen).
- [ ] Securely manage API keys and credentials (e.g., via `.env` files).
- [ ] Replace mock generators with actual API-calling generators for each `Kind`.
- [ ] Implement a simple caching mechanism for API calls to reduce costs during development.

### Phase 3: Advanced Features

- [ ] Implement complex/composite `Kind`s like `StoryBoard`.
- [ ] Refine the dependency injection mechanism (e.g., `prompt: "An image of ${story.outputs[0].content}"`).
- [ ] Add support for more APIs and `Kind`s.

### Phase 4: Kubernetes Integration (Future)

- [ ] Design and create a `CustomResourceDefinition` (CRD) for KubeGen resources.
- [ ] Develop a Kubernetes Operator/Controller to watch for these CRs and trigger the generation engine.

## 4. Proposed Project Structure

```
kubegen/
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
│         ├─── cli.py          # Command Line Interface
│         ├─── engine.py       # Core processing engine, dependency resolution
│         ├─── parser.py       # YAML manifest parsing
│         └─── kinds/          # Handlers for each resource Kind
│              ├─── __init__.py
│              ├─── base.py
│              ├─── image.py
│              ├─── text.py
│              └─── video.py
└─── tests/
     ├─── test_parser.py
     └─── test_engine.py
```