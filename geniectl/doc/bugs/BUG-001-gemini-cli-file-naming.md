# Bug Report: Gemini-CLI Fails to Correctly Rename Output Files

- **ID**: BUG-001
- **Status**: Identified
- **Severity**: High

## Summary

The `gemini-cli` tool, when instructed to generate an image and save it to a specific output file path, fails to do so correctly. It successfully generates the image but saves it with its own internal, timestamped naming convention. Its subsequent attempts to rename the file to the user-requested path result in the creation of an empty or invalid text file, not a copy or rename of the actual image.

## Analysis

During the execution of an `ImageGeneration` resource with 4 replicas, we observed the following:

1.  The `geniectl` tool correctly constructed a prompt instructing `gemini-cli` to generate 4 images and save them with the pattern `story-illustration_{i}.png`.
2.  The `gemini-cli` tool reported success and claimed to be renaming the files.
3.  Our engine's post-generation verification step, which uses the `file` command, correctly identified that the final `story-illustration_*.png` files were `ASCII text` and not valid images.
4.  A manual check of the `out/` directory revealed that `gemini-cli` *did* successfully create the images, but under its own generated names (e.g., `imagen-imagen-3.0-generate-002-20250914-135754-0.png`).

### Evidence

Output of `file out/*.png`:

```
out/imagen-imagen-3.0-generate-002-20250914-135754-0.png: PNG image data, 1024 x 1024, 8-bit/color RGB, non-interlaced
...
out/story-illustration_1.png:                             ASCII text, with no line terminators
out/story-illustration_2.png:                             ASCII text, with no line terminators
...
```

This proves that the image generation itself is working, but the file handling and renaming logic within the `gemini-cli` tool is buggy.

## Proposed Workaround

The only reliable way to solve this from within the `geniectl` tool is to implement a "parse and rename" strategy in the `ImageGenerationHandler`:

1.  Capture the `stdout` of the `gemini-cli` command during execution.
2.  Parse the output to extract the actual, generated filenames.
3.  After the `gemini-cli` process completes, our handler will execute a series of `mv` commands to rename the generated files to the filenames expected by our manifest.
