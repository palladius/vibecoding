import os
import click
from .base import BaseHandler

class AudioGenerationHandler(BaseHandler):
    """Handler for the AudioGeneration kind."""
    def generate(self):
        model = self.spec.get('model', 'unknown')
        language = self.spec.get('language', 'en')
        output_spec = self.spec.get('output', {})
        output_path = output_spec.get('path')

        if not output_path:
            click.echo(f"Error: AudioGeneration resource '{self.metadata.get('name')}' is missing spec.output.path.", err=True)
            return

        full_output_path = os.path.join(self.output_dir, output_path)

        # 1. Idempotency Check
        if os.path.exists(full_output_path):
            click.echo(f"   - Skipping: File already exists at {full_output_path}")
            return

        # 2. Get input text from dependency
        input_text = ""
        dependencies = self.spec.get('depends_on', [])
        if dependencies:
            dep_key = dependencies[0] # Assuming one dependency for now
            dep_doc = self.all_resources.get(dep_key)
            if dep_doc:
                dep_output_path = dep_doc.get('spec', {}).get('output', {}).get('path')
                if dep_output_path:
                    dep_full_path = os.path.join(self.output_dir, dep_output_path)
                    try:
                        with open(dep_full_path, 'r') as f:
                            input_text = f.read()
                        click.echo(f"   - Reading input from: {dep_full_path}")
                    except FileNotFoundError:
                        click.echo(f"   - Error: Dependency output file not found at {dep_full_path}", err=True)
                        click.echo(f"     (Maybe the dependency '{dep_key}' did not run correctly?)")
                        return # Stop processing if dependency output is missing
                else:
                    click.echo(f"   - Error: Dependency '{dep_key}' has no output path defined.", err=True)
                    return
            else:
                click.echo(f"   - Error: Dependency '{dep_key}' not found in resources.", err=True)
                return
        else:
            # Fallback if no dependency is specified
            input_text = "No dependency specified. This is a mock audio generation."


        click.echo(f"-> Generating Audio for '{self.metadata.get('name')}' (Model: {model}, Lang: {language})...")

        # 3. Mock Audio Generation
        content = f'''--- MOCK AUDIO FILE ---
Input Text: "{input_text}"
'''

        os.makedirs(os.path.dirname(full_output_path), exist_ok=True)

        with open(full_output_path, 'w') as f:
            f.write(content)

        click.echo(f"   - Saved to: {full_output_path}")
