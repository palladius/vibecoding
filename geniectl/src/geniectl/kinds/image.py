import os
import click
import subprocess
import json
from pathlib import Path
from .base import BaseHandler
from ..exceptions import NotImplementedEngineError

class ImageGenerationHandler(BaseHandler):
    """Handler for the ImageGeneration kind."""

    def _generate_native(self):
        message = "The 'Native' engine for ImageGeneration is not implemented yet."
        click.echo(f"   - 🚧 Error: {message}", err=True)
        raise NotImplementedEngineError(message)

    def _generate_geminicli(self):
        """Generates images, parses JSON output, and renames files."""
        prompt = self.spec.get('prompt', 'No prompt provided.')
        replicas = self.spec.get('replicas', 1)
        output_path_str = self.spec.get('output', {}).get('path')

        if not output_path_str:
            message = "ImageGeneration resource is missing spec.output.path."
            click.echo(f"   - 🚧 Error: {message}", err=True)
            raise ValueError(message)

        output_path = Path(output_path_str)
        base_name = output_path.stem
        extension = output_path.suffix

        expected_files = [os.path.join(self.output_dir, f"{base_name}_{i}{extension}") for i in range(1, replicas + 1)]
        if all(os.path.exists(f) for f in expected_files):
            click.echo(f"   - Skipping: All {replicas} image files already exist.")
            return

        # Construct the prompt with JSON output instruction
        output_naming_pattern = f"{base_name}_{{i}}{extension}"
        full_prompt = f"""Use `imagen_t2i` Tool to Generate {replicas} images with the prompt: '{prompt}'.

        ## Important

        The output files should be named according to the pattern: '{output_naming_pattern}', where i is the 1-based index.
        After the generation is complete, you MUST print a JSON object to standard output, and nothing else.
        If successful, the JSON format is: {{'result': ['/path/to/image_1.png', '/path/to/image_2.png']}}
        If there is an error, the JSON format is: {{'error': 'your error message'}}
        """

        click.echo(click.style(f"   - Prompt: {full_prompt}", fg='blue'))
        gemini_command = self._gemini_command_from_prompt(full_prompt)

        try:
            click.echo(f"   - Requesting {replicas} image(s) via Gemini CLI...")
            result = subprocess.run(gemini_command, check=True, capture_output=True, text=True)
            stdout = result.stdout
            data = self._parse_json_from_gemini_output(stdout)

            if data:
                if "error" in data:
                    click.echo(f"   - 🚧 Error from Gemini CLI: {data['error']}", err=True)
                    return

                generated_files = data.get("result", [])
                if len(generated_files) != len(expected_files):
                    click.echo(f"   - 🚧 Error: Gemini CLI generated {len(generated_files)} files, but we expected {len(expected_files)}.", err=True)
                    return

                # Rename the files
                click.echo("   - Renaming generated files...")
                for i, generated_file in enumerate(generated_files):
                    expected_file = expected_files[i]
                    if os.path.exists(generated_file):
                        os.rename(generated_file, expected_file)
                        click.echo(f"     - Renamed {generated_file} -> {expected_file}")
                    else:
                        click.echo(f"   - 🚧 Error: Generated file not found: {generated_file}", err=True)

        except FileNotFoundError:
            message = "'gemini' command not found. Make sure it is installed and in your PATH."
            click.echo(f"   - 🚧 Error: {message}", err=True)
            raise FileNotFoundError(message)
        except subprocess.CalledProcessError as e:
            message = f"Error executing Gemini CLI: {e}\nSTDOUT: {e.stdout}\nSTDERR: {e.stderr}"
            click.echo(f"   - 🚧 Error: {message}", err=True)

    def _generate_mcp(self):
        message = "The 'MCP' engine for ImageGeneration is not implemented yet."
        click.echo(f"   - 🚧 Error: {message}", err=True)
        raise NotImplementedEngineError(message)

    def _post_generate_check(self):
        replicas = self.spec.get('replicas', 1)
        output_path_str = self.spec.get('output', {}).get('path')
        if output_path_str:
            output_path = Path(output_path_str)
            base_name = output_path.stem
            extension = output_path.suffix
            for i in range(1, replicas + 1):
                replica_filename = f"{base_name}_{i}{extension}"
                full_output_path = os.path.join(self.output_dir, replica_filename)
                self._verify_file_type(full_output_path, ["png image data", "jpeg image data"])

    def emoji(self):
        return "🏞️"
