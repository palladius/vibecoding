import os
import click
import subprocess
import google.generativeai as genai
from .base import BaseHandler

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
        click.echo("   - Error: The 'MCP' engine for TextGeneration is not implemented yet.", err=True)

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
        """Generates text by shelling out to the 'gemini' CLI tool."""
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
        gemini_command = ["gemini-cli", "-p", prompt]

        try:
            os.makedirs(os.path.dirname(full_output_path), exist_ok=True)
            with open(full_output_path, "w") as f:
                subprocess.run(gemini_command, stdout=f, check=True)
            click.echo(f"   - Saved to: {full_output_path}")
        except FileNotFoundError:
            click.echo("   - Error: 'gemini' command not found. Make sure the Gemini CLI is installed and in your PATH.", err=True)
        except subprocess.CalledProcessError as e:
            click.echo(f"   - Error executing Gemini CLI: {e}", err=True)
