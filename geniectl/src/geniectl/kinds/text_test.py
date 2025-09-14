import os
from .text import TextGenerationHandler

def test_text_generation_skips_if_file_exists(tmp_path, capsys):
    """Asserts that the handler skips generation if the output file exists."""
    # 1. Setup
    output_dir = tmp_path
    output_filename = "test_output.md"
    full_output_path = os.path.join(output_dir, output_filename)
    original_content = "ORIGINAL CONTENT"

    # Pre-create the output file
    with open(full_output_path, 'w') as f:
        f.write(original_content)

    # Mock resource document and config
    mock_doc = {
        'apiVersion': 'kine-matic.io/v1alpha1',
        'kind': 'TextGeneration',
        'metadata': {'name': 'test-text'},
        'spec': {
            'prompt': 'A prompt that should not be used',
            'output': {'path': output_filename}
        }
    }
    mock_config = {
        'defaults': {'models': {'TextGeneration': 'gemini-1.5-flash'}}
    }

    # 2. Instantiate and Run
    handler = TextGenerationHandler(mock_doc, output_dir, all_resources={}, config=mock_config)
    handler.generate()

    # 3. Assert
    # Assert the file content has not changed
    with open(full_output_path, 'r') as f:
        content_after_run = f.read()
    assert content_after_run == original_content

    # Assert the correct message was printed to stdout
    captured = capsys.readouterr()
    assert "Skipping: File already exists" in captured.out
