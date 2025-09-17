"""
This module defines the GeminiCLI kind, which is used to interact with the Gemini CLI.
"""

import subprocess
import os
import click
from .base import BaseHandler

class GeminiCLI(BaseHandler):
    """
    A kind that represents a call to the Gemini CLI.
    """    
    def _generate_native(self):
        click.echo("   - Error: The 'Native' engine is not applicable to the GeminiCLI kind.", err=True)

    def _generate_geminicli(self):
        """Executes the Gemini CLI command."""
        prompt = self.spec.get('prompt')
        if not prompt:
            raise ValueError("Prompt is not defined in the spec for GeminiCLI kind")

        output_config = self.spec.get('output')
        if not output_config or 'path' not in output_config:
            # For this kind, output might be optional if it just prints to stdout
            # or if the instruction doesn't generate a file.
            # Depending on strictness, we could raise an error or just proceed.
            pass

        output_path = os.path.join(self.output_dir, output_config.get('path', '')) if output_config else None

        # Ensure the output directory exists if a path is specified
        if output_path:
            os.makedirs(os.path.dirname(output_path), exist_ok=True)

        # The prompt for this kind is the full command for the gemini cli
        click.echo(click.style(f"   - Prompt: {prompt}", fg='blue'))
        gemini_command = self._gemini_command_from_prompt(prompt)

        try:
            click.echo(f"   - Executing: {' '.join(gemini_command)}")
            result = subprocess.run(gemini_command, check=True, capture_output=True, text=True)
            if output_path:
                with open(output_path, "w") as f:
                    f.write(result.stdout)
                click.echo(f"   - Saved to: {output_path}")
            else:
                click.echo(result.stdout)
        except FileNotFoundError:
            click.echo("   - Error: 'gemini' command not found. Make sure the Gemini CLI is installed and in your PATH.", err=True)
            raise
        except subprocess.CalledProcessError as e:
            click.echo(f"   - Error executing Gemini CLI: {e}", err=True)
            raise

    def _generate_mcp(self):
        click.echo("   - Error: The 'MCP' engine is not applicable to the GeminiCLI kind.", err=True)

    def emoji(self):
        return "♊"
