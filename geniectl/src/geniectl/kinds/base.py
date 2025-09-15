from abc import ABC, abstractmethod
import click
import subprocess
import os
import json

class BaseHandler(ABC):
    """Abstract base class for all Kind handlers."""
    def __init__(self, doc, output_dir, all_resources, config):
        self.doc = doc
        self.output_dir = output_dir
        self.all_resources = all_resources
        self.config = config
        self.spec = doc.get('spec', {})
        self.metadata = doc.get('metadata', {})

    def generate(self):
        """Dispatches to the correct engine implementation."""
        engine = self.spec.get('engine', 'Native')

        click.echo(f"-> Generating for '{self.metadata.get('name')}' using [{engine}] engine...")

        if engine == 'Native':
            return self._generate_native()
        elif engine == 'GeminiCLI':
            return self._generate_geminicli()
        elif engine == 'MCP':
            return self._generate_mcp()
        else:
            click.echo(f"   - Error: Engine '{engine}' is not supported.", err=True)

    @abstractmethod
    def _generate_native(self):
        """Generates the asset using the Native (Python) engine."""
        pass

    @abstractmethod
    def _generate_geminicli(self):
        """Generates the asset using the GeminiCLI engine."""
        pass

    @abstractmethod
    def _generate_mcp(self):
        """Generates the asset using the MCP engine."""
        pass

    def _post_generate_check(self):
        """Optional post-generation checks for the created asset."""
        pass

    def _verify_file_type(self, file_path, keywords):
        """Uses the 'file' command to verify the type of a file."""
        if not os.path.exists(file_path):
            return

        try:
            result = subprocess.run(["file", file_path], check=True, capture_output=True, text=True)
            file_type = result.stdout.lower()

            if not any(keyword in file_type for keyword in keywords):
                click.echo(f"   - ❌ Error: Verification failed. Expected a file containing one of '{keywords}', but type was: {result.stdout.strip()}", err=True)
                try:
                    os.remove(file_path)
                    click.echo(f"     - Removed invalid file: {file_path}", err=True)
                except OSError as e:
                    click.echo(f"     - Failed to remove invalid file: {e}", err=True)
            else:
                click.echo(f"   - ✅ Verification successful: Output file type is correct.")

        except FileNotFoundError:
            click.echo("   - Warning: 'file' command not found. Skipping file type verification.", err=True)
        except subprocess.CalledProcessError as e:
            click.echo(f"   - Warning: 'file' command failed during verification: {e}", err=True)

    def _gemini_command_from_prompt(self, prompt):
        """Constructs the standard gemini command list from a prompt string."""
        return [
            "gemini", "-c",
            "--approval-mode", "auto_edit",
            "--session-summary", ".tmp.session-summary.json",
            "--prompt", prompt]

    def _parse_json_from_gemini_output(self, raw_output):
        """
        Parses a JSON object from the raw output of the Gemini CLI,
        stripping markdown fences if they exist.
        """
        json_string = raw_output
        if "```json" in json_string:
            json_string = json_string.split("```json")[1].split("```")[0]

        json_string = json_string.strip()

        try:
            return json.loads(json_string)
        except json.JSONDecodeError:
            click.echo("   - 🚧 Error: Failed to parse JSON output from Gemini CLI.", err=True)
            click.echo(f"     Raw output: {raw_output}", err=True)
            return None
