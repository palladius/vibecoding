# High-Level Test Plan

This document outlines the high-level tests that should be implemented for `geniectl`.

## CLI Tests

- [ ] Test `apply` command with a single file.
- [ ] Test `apply` command with a directory.
- [ ] Test that the `--output-dir` option works as expected.
- [ ] Test that the tool handles non-existing input files and directories gracefully.
- [ ] Test that the tool handles malformed YAML files gracefully.
- [ ] Test that the tool handles YAML files with incorrect schema (e.g., missing `kind` or `metadata`).

## Parser Tests

- [ ] Test parsing of a single-document YAML file.
- [ ] Test parsing of a multi-document YAML file.
- [ ] Test that empty documents in a multi-document YAML are filtered out.

## Engine Tests

- [ ] Test that the dependency graph is built correctly from the manifests.
- [ ] Test that the engine correctly detects dependency cycles.
- [ ] Test that the topological sort produces the correct execution order.
- [ ] Test that resources with unknown `apiVersion` are skipped.
- [ ] Test that resources with an unknown `kind` (i.e., no handler implemented) are skipped.
- [ ] Test that the `config.yaml` is loaded and used correctly.
- [ ] Test that the engine works correctly when `config.yaml` is not present.

## Handler Tests

### TextGeneration Handler

- [ ] Test that the handler skips generation if the output file already exists.
- [ ] Test that the handler correctly uses the model specified in the manifest.
- [ ] Test that the handler falls back to the default model from the config.
- [ ] Test that the handler generates the output file with the expected content (mocked).

### AudioGeneration Handler

- [ ] Test that the handler skips generation if the output file already exists.
- [ ] Test that the handler correctly reads the content from its dependency's output file.
- [ ] Test that the handler gracefully handles cases where the dependency's output file is missing.
- [ ] Test that the handler generates the output file with the expected content (mocked).
- [ ] Test the generated file has expected content with `file` functionality. Eg, `file out/bedtime-story-en.wav => out/bedtime-story-en.wav: ASCII text` should be a failure.
