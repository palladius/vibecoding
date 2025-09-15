import os
import click
import subprocess
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
        """Generates multiple images in a single call to the 'gemini-cli' tool."""
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

        # Check if all files already exist before making the API call
        expected_files = [os.path.join(self.output_dir, f"{base_name}_{i}{extension}") for i in range(1, replicas + 1)]
        if all(os.path.exists(f) for f in expected_files):
            click.echo(f"   - Skipping: All {replicas} image files already exist.")
            return

        # Construct a single prompt for multiple images
        output_naming_pattern = f"{base_name}_{{i}}{extension}"
        image_model = "imagen_t2i"
        full_prompt = f"""Use `imagen_t2i` Tool with {image_model} to Generate {replicas} images with the prompt: '{prompt}'.

        ## Important

        Naming is important. The output files should be named according to the pattern: '{output_naming_pattern}', where i is the 1-based index (from 1 to {replicas}). For instance:

        * {output_naming_pattern.replace('{i}', '1')}
        * {output_naming_pattern.replace('{i}', '2')}
        * ...
        """

        click.echo(click.style(f"   - Prompt: {full_prompt}", fg='blue'))
        gemini_command = self._gemini_command_from_prompt(full_prompt)

        try:
            click.echo(f"   - Requesting {replicas} image(s) in a single call via Gemini CLI...")
            subprocess.run(gemini_command, check=True)
            click.echo(f"   - Successfully requested image generation.")
        except FileNotFoundError:
            message = "'gemini' command not found. Make sure it is installed and in your PATH."
            click.echo(f"   - 🚧 Error: {message}", err=True)
            raise FileNotFoundError(message)
        except subprocess.CalledProcessError as e:
            message = f"Error executing Gemini CLI: {e}"
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