This project is called  **Kine-matic** while the CLI is called `geniectl` and it's on PyPI.

It's a tool to declaratively generate multimedia assets using Kubernetes-like YAML files.

The PRD is under `PRD.md`. Read it very attentively.

Please read the `PLAN.md` file to understand the vision and the development phases.

The main language of choice will be Python, using `uv` for dependency management.

Do not write any code until the plan is approved and the core scaffolding is in place.

## Feedback loop

When new functionality is added, make sure:

* There are reasonable unit tests for each CUJ/flow.
* Run `just test` and ensure it works.
* Update `CHANGELOG.md` and version in `pyproject.toml`.
* Ask user if (1) its ok to commit and (2) also ok to publish the new version to PyPI (via `just publish`).
  * `git push` is up to user.

## Notes

* Do not clobber `justfile` unless user asks you to add a new `just SOMETHING` to it. Let's keep it minimal.
* Before removing a file (rm, or git rm), **ALWAYS** confirm with user first.
* Range indexing for multiple assets is human-style: 1..4 not 0..3
