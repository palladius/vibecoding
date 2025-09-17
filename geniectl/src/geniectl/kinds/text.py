import os
import click
import subprocess
import google.generativeai as genai
from .base import BaseHandler
from ..exceptions import NotImplementedEngineError

class TextGenerationHandler(BaseHandler):
    """Handler for the TextGeneration kind."""

    def __init__(self, doc, output_dir, all_resources, config):
        super().__init__(doc, output_dir, all_resources, config)
        # Configure the API for the Native engine.
        try:
            genai.configure()
        except Exception as e:
            click.echo(f"Warning: Could not configure Generative AI for Native engine: {e}", err=True)

    def _generate_mcp(self):
        message = "The 'MCP' engine for TextGeneration is not implemented yet."
        click.echo(f"   - 🚧 Error: {message}", err=True)
        raise NotImplementedEngineError(message)

    def _generate_native(self):
        """Generates text using the google-generativeai library directly."""
        output_spec = self.spec.get('output', {})
        output_path = output_spec.get('path')

        if not output_path:
            click.echo(f"   - Error: Resource is missing spec.output.path.", err=True)
            return

        full_output_path = os.path.join(self.output_dir, output_path)

        if os.path.exists(full_output_path):
            click.echo(f"   - Skipping: File already exists at {full_output_path}")
            return

        default_model = self.config.get('defaults', {}).get('models', {}).get('TextGeneration', 'gemini-1.5-flash')
        model_name = self.spec.get('model', default_model)
        prompt = self.spec.get('prompt', 'No prompt provided.')

        try:
            model = genai.GenerativeModel(model_name)
            response = model.generate_content(prompt)
            content = response.text
        except Exception as e:
            click.echo(f"   - Error calling Gemini API: {e}", err=True)
            content = f'''--- ERROR DURING GENERATION ---
Prompt: "{prompt}"
Error: {e}'''

        os.makedirs(os.path.dirname(full_output_path), exist_ok=True)
        with open(full_output_path, 'w') as f:
            f.write(content)

        click.echo(f"   - Saved to: {full_output_path}")

    def _generate_geminicli(self):
        """Generates text by shelling out to the 'gemini-cli' tool and capturing stdout."""
        output_spec = self.spec.get('output', {})
        output_path = output_spec.get('path')

        if not output_path:
            click.echo(f"   - Error: Resource is missing spec.output.path.", err=True)
            return

        full_output_path = os.path.join(self.output_dir, output_path)

        if os.path.exists(full_output_path):
            click.echo(f"   - Skipping: File already exists at {full_output_path}")
            return

        prompt = self.spec.get('prompt', 'No prompt provided.')
        click.echo(click.style(f"   - Prompt: {prompt}", fg='blue'))
        
        gemini_command = self._gemini_command_from_prompt(prompt)
        gemini_command.extend(["--include-directories", os.getcwd()])

        try:
            os.makedirs(self.output_dir, exist_ok=True)
            with open(os.path.join(self.output_dir, output_path), "w") as f:
                subprocess.run(gemini_command, stdout=f, check=True, cwd=self.output_dir)
            click.echo(f"   - Saved to: {full_output_path}")
        except FileNotFoundError:
            message = f"'{gemini_cli_path}' command not found. Make sure it is installed and in your PATH."
            click.echo(f"   - 🚧 Error: {message}", err=True)
            raise FileNotFoundError(message)
        except subprocess.CalledProcessError as e:
            click.echo(f"   - Error executing Gemini CLI: {e}", err=True)