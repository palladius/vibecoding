"""
This module defines the CustomGeminiCLIGeneration kind, which is used to interact with the Gemini CLI for custom generation tasks.
"""

import subprocess
import os
import click
from .base import BaseHandler

class CustomGeminiCLIGeneration(BaseHandler):
    """
    A kind that represents a call to the Gemini CLI for custom generation tasks.
    """
    def _generate_native(self):
        click.echo("   - Error: The 'Native' engine is not applicable to the CustomGeminiCLIGeneration kind.", err=True)

    def _generate_geminicli(self):
        """Executes the Gemini CLI command for each replica."""
        prompt = self.spec.get('prompt')
        if not prompt:
            raise ValueError("Prompt is not defined in the spec for CustomGeminiCLIGeneration kind")

        output_config = self.spec.get('output')
        if not output_config or 'path' not in output_config:
            raise ValueError("Output path is not defined in the spec for CustomGeminiCLIGeneration kind")

        output_path = os.path.join(self.output_dir, output_config['path'])
        replicas = self.spec.get('replicas', 1)

        # Ensure the output directory exists
        os.makedirs(os.path.dirname(output_path), exist_ok=True)

        for i in range(1, replicas + 1):
            # Modify the prompt for each replica if needed
            replica_prompt = prompt.replace('{i}', str(i))
            
            # Modify the output path for each replica
            base, ext = os.path.splitext(output_path)
            replica_output_path = f"{base}_{i}{ext}"

            click.echo(click.style(f"   - Prompt for replica {i}: {replica_prompt}", fg='blue'))
            gemini_command = self._gemini_command_from_prompt(replica_prompt)

            try:
                click.echo(f"   - Executing for replica {i}: {' '.join(gemini_command)}")
                result = subprocess.run(gemini_command, check=True, capture_output=True, text=True)
                
                with open(replica_output_path, "w") as f:
                    f.write(result.stdout)
                click.echo(f"   - Saved replica {i} to: {replica_output_path}")

            except FileNotFoundError:
                click.echo("   - Error: 'gemini' command not found. Make sure the Gemini CLI is installed and in your PATH.", err=True)
                raise
            except subprocess.CalledProcessError as e:
                click.echo(f"   - Error executing Gemini CLI for replica {i}: {e}", err=True)
                raise

    def _generate_mcp(self):
        click.echo("   - Error: The 'MCP' engine is not applicable to the CustomGeminiCLIGeneration kind.", err=True)

    def emoji(self):
        return "✨"
