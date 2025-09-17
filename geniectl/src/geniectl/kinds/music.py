"""
This module defines the MusicGeneration kind, which is used to generate music.
"""

import os
import click
import subprocess
import json
from .base import BaseHandler
from ..exceptions import NotImplementedEngineError

class MusicGenerationHandler(BaseHandler):
    """Handler for the MusicGeneration kind."""

    def _generate_native(self):
        message = "The 'Native' engine for MusicGeneration is not implemented yet."
        click.echo(f"   - 🚧 Error: {message}", err=True)
        raise NotImplementedEngineError(message)

    def _generate_geminicli(self):
        """Generates music, parses JSON output, and renames the file."""
        # 1. Get spec parameters
        output_path = self.spec.get('output', {}).get('path')

        if not output_path:
            click.echo(f"   - Error: Resource is missing spec.output.path.", err=True)
            return

        full_output_path = os.path.join(self.output_dir, output_path)

        if os.path.exists(full_output_path):
            click.echo(f"   - Skipping: File already exists at {full_output_path}")
            return

        # 2. Get input text from dependency
        prompt = self.spec.get('prompt', '')

        # 3. Construct the prompt
        full_prompt = f'''Generate music from text. Use as text the following: {prompt}

        ## Important

        The output file should be named according to the pattern: '{output_path}'.
        After the generation is complete, you MUST print a JSON object to standard output, and nothing else.
        * If successful, the JSON format is: {{'result': ['/path/to/audio.wav']}}
        * If there is an error, the JSON format is: {{'error': 'your error message'}}.

        IMPORTANT: DO NOT PRINT ANYTHING ELSE THAN THE JSON OBJECT!
        '''


        click.echo(click.style(f"   - Prompt: {full_prompt}", fg='blue'))

        # 4. Execute the command
        gemini_command = self._gemini_command_from_prompt(full_prompt)
        try:
            click.echo(f"   - Requesting music generation via Gemini CLI...")
            result = subprocess.run(gemini_command, check=True, capture_output=True, text=True)
            stdout = result.stdout
            data = self._parse_json_from_gemini_output(stdout)

            if data:
                if "error" in data:
                    click.echo(f"   - 🚧 Error from Gemini CLI: {data['error']}", err=True)
                    return

                generated_files = data.get("result", [])
                if len(generated_files) != 1:
                    click.echo(f"   - 🚧 Error: Gemini CLI generated {len(generated_files)} files, but we expected 1.", err=True)
                    return

                # Rename the file
                generated_file = generated_files[0]
                if os.path.exists(generated_file):
                    os.rename(generated_file, full_output_path)
                    click.echo(f"     - Renamed {generated_file} -> {full_output_path}")
                else:
                    click.echo(f"   - 🚧 Error: Generated file not found: {generated_file}", err=True)

        except FileNotFoundError:
            click.echo("   - Error: 'gemini' command not found. Make sure the Gemini CLI is installed and in your PATH.", err=True)
        except subprocess.CalledProcessError as e:
            click.echo(f"   - Error executing Gemini CLI: {e}\nSTDOUT: {e.stdout}\nSTDERR: {e.stderr}", err=True)

    def _generate_mcp(self):
        message = "The 'MCP' engine for MusicGeneration is not implemented yet."
        click.echo(f"   - 🚧 Error: {message}", err=True)
        raise NotImplementedEngineError(message)

    def _post_generate_check(self):
        output_path = self.spec.get('output', {}).get('path')
        if output_path:
            full_output_path = os.path.join(self.output_dir, output_path)
            self._verify_file_type(full_output_path, ["audio"])

    def emoji(self):
        return "🎵"
