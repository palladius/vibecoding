import os
import click
import subprocess
from .base import BaseHandler

class AudioGenerationHandler(BaseHandler):
    """Handler for the AudioGeneration kind."""

    def _generate_native(self):
        click.echo("   - Error: The 'Native' engine for AudioGeneration is not implemented yet.", err=True)

    def _generate_geminicli(self):
        """Generates audio by shelling out to the 'gemini' CLI tool."""
        # 1. Get spec parameters
        model = self.spec.get('model', 'unknown')
        language = self.spec.get('language', 'en')
        output_path = self.spec.get('output', {}).get('path')

        if not output_path:
            click.echo(f"   - Error: Resource is missing spec.output.path.", err=True)
            return

        full_output_path = os.path.join(self.output_dir, output_path)

        if os.path.exists(full_output_path):
            click.echo(f"   - Skipping: File already exists at {full_output_path}")
            return

        # 2. Get input text from dependency
        input_text = ""
        dependencies = self.spec.get('depends_on', [])
        if not dependencies:
            click.echo(f"   - Error: AudioGeneration requires a dependency to provide the input text.", err=True)
            return

        dep_key = dependencies[0]
        dep_doc = self.all_resources.get(dep_key)
        if not dep_doc:
            click.echo(f"   - Error: Dependency '{dep_key}' not found.", err=True)
            return

        dep_output_path = dep_doc.get('spec', {}).get('output', {}).get('path')
        if not dep_output_path:
            click.echo(f"   - Error: Dependency '{dep_key}' has no output path defined.", err=True)
            return

        dep_full_path = os.path.join(self.output_dir, dep_output_path)
        try:
            with open(dep_full_path, 'r') as f:
                input_text = f.read()
        except FileNotFoundError:
            # This should be caught by the engine's main dependency check, but as a safeguard:
            click.echo(f"   - Error: Dependency output file not found at {dep_full_path}", err=True)
            return

        # 3. Construct the prompt
        prompt = f'Generate audio from text using chirp_tts tool with {model} model and choosing a voice from language "{language}". Use as text the following: {input_text}'
        full_prompt = f'{prompt}. \n\n **IMPORTANT** The output file should be {full_output_path}. If the file created has a different name, remember to rename it appropriately!'

        # 4. Execute the command
        gemini_command = ["gemini", "--approval-mode", "auto_edit", "-p", full_prompt]
        try:
            click.echo(f"   - Requesting audio generation via Gemini CLI...")
            subprocess.run(gemini_command, check=True)
            click.echo(f"   - Successfully requested audio generation for: {full_output_path}")
        except FileNotFoundError:
            click.echo("   - Error: 'gemini' command not found. Make sure the Gemini CLI is installed and in your PATH.", err=True)
        except subprocess.CalledProcessError as e:
            click.echo(f"   - Error executing Gemini CLI: {e}", err=True)

    def _generate_mcp(self):
        click.echo("   - Error: The 'MCP' engine for AudioGeneration is not implemented yet.", err=True)
