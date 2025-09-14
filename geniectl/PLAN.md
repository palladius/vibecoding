# Kine-matic Project Plan

## 1. Vision & Goal

Kine-matic is a command-line tool (`geniectl`) that uses Kubernetes-like YAML manifests to declaratively define, generate, and manage complex multimedia assets. It orchestrates calls to various generative APIs, handles dependencies between assets, and ensures that generation is idempotent.

The primary goal is to provide a reproducible and version-controllable way to create creative assets like storyboards, videos with soundtracks, illustrated articles, and more.

## 2. Core Concepts

- **Manifest:** A YAML file defining one or more resources to be generated.
- **Resource:** A single asset definition, similar to a Kubernetes resource. It has an `apiVersion`, `kind`, `metadata`, and `spec`.
- **Kind:** The type of the resource to be generated (e.g., `Image`, `Video`, `Text`, `GeminiCLI`).
- **Orchestrator:** The core logic that parses manifests, builds a dependency graph, and executes generation tasks.
- **Engine:** An attribute within a resource's `spec` that specifies *how* a resource should be generated. Supported engines include:
    - `Native`: Execution via a dedicated Python function.
    - `GeminiCLI`: Execution by generating a prompt for the Gemini CLI.
    - `MCP`: Execution by calling a service on a Model-Centric Platform (MCP).
- **Replicas:** A `spec` attribute to define how many instances of an asset to generate (e.g., `replicas: 4` for four different images from the same prompt).
- **Templating:** A mechanism to inject outputs from one resource into the inputs of another, allowing for dynamic dependency chains (e.g., `prompt: "An image of ${story.outputs[0].content}"`).
- **Idempotency:** The orchestrator will check for existing outputs and compare input hashes. If nothing has changed, no action will be taken.

## 3. Development Phases

### Phase 1: Core Engine & Scaffolding (No API calls)

- [x] **Project Setup:**
    - [x] Create project folder `geniectl`.
    - [x] Create initial `PLAN.md`, `README.md`, `GEMINI.md`, `PRD.md`.
    - [x] Create `etc/story-generation.yaml`.
    - [x] Set up `justfile` for common commands.
    - [x] Initialize a Python project with `uv`.
- [ ] **YAML Specification (v1alpha1):**
    - [ ] Finalize the structure for `apiVersion`, `kind`, `metadata`, `spec`, and `status`.
    - [ ] Define the `spec` for initial kinds: `Text`, `Image`, `Audio`, `Video`, and the special `GeminiCLI` kind.
    - [ ] Add `spec.engine` to define the execution engine (`Native`, `GeminiCLI`, `MCP`).
    - [ ] Add `spec.replicas` to control the number of generated outputs.
- [ ] **Core Orchestrator Implementation:**
    - [ ] Implement YAML manifest parser.
    - [ ] Build a dependency graph from the manifests.
    - [ ] Implement a simple templating engine to resolve dependencies (e.g., `${resource.output}`).
    - [ ] Create a simple task runner to process the graph.
    - [ ] Implement a hashing mechanism for the `spec` of each resource to detect changes.
    - [ ] Implement mock "generator" functions for each `Kind` and `Engine` combination. These mocks will create placeholder output files.
    - [ ] Implement logic to update the manifest (or a `.hydrated.yaml` file) with output status and file paths.
- [x] **CLI:**
    - [x] Create a basic CLI using `click`.
    - [x] Implement `geniectl apply -f <file_or_directory>` to run the generation process.
    - [ ] Implement `--plan`/`--dry-run` to display the execution plan without running it.

### Phase 2: API Integration

- [ ] Integrate with Google Cloud generative APIs (e.g., Vertex AI with Gemini, Imagen).
- [ ] Securely manage API keys and credentials (e.g., via `.env` files).
- [ ] Replace mock generators with actual API-calling generators for each `Kind` and `Engine`.
- [ ] Implement a simple caching mechanism for API calls to reduce costs during development.

### Phase 3: Advanced Features

- [ ] Implement complex/composite `Kind`s like `StoryBoard` and `Scene`.
- [ ] Refine the dependency injection mechanism (e.g., `prompt: "An image of ${story.outputs[0].content}"`).
- [ ] Add support for more APIs and `Kind`s.

### Phase 4: Kubernetes Integration (Future)

- [ ] Design and create a `CustomResourceDefinition` (CRD) for Kine-matic resources.
- [ ] Develop a Kubernetes Operator/Controller to watch for these CRs and trigger the generation engine.

## 4. Implementation Status Matrix

This matrix tracks the implementation status for each `(Kind, Engine)` combination.

| Kind              | `Native` (🐍) | `GeminiCLI` (♊) | `MCP` (🌐) |
| ----------------- | :----------: | :-------------: | :-------: |
| `TextGeneration`  |      ✅      |       🚧        |    ❌     |
| `ImageGeneration` |      ✅      |       ❌        |    ❌     |
| `AudioGeneration` |      ✅      |       ❌        |    ❌     |
| `VideoGeneration` |      ❌      |       ❌        |    ❌     |
| `GeminiCLI`       |      N/A     |       ✅        |    N/A    |

**Legend:**
- ✅: Implemented & Tested
- 🚧: In Progress / Partially Implemented
- ❌: Not Implemented
- N/A: Not Applicable

## 5. Proposed Project Structure

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
│    └─── story-generation.yaml
├─── src/
│    └─── geniectl/
│         ├─── __init__.py
│         ├─── cli.py          # Command Line Interface
│         ├─── engine.py       # Core orchestrator, dependency resolution, task running
│         ├─── parser.py       # YAML manifest parsing
│         └─── kinds/          # Handlers for each resource Kind
│              ├─── __init__.py
│              ├─── base.py     # Base class for Kind handlers
│              ├─── image.py    # Handler for Kind=Image (with methods for each engine)
│              ├─── text.py     # Handler for Kind=Text
│              └─── video.py    # ...and so on
└─── tests/
     ├─── test_parser.py
     └─── test_engine.py
```