import os
import click
from .base import BaseHandler

class TextGenerationHandler(BaseHandler):
    """Handler for the TextGeneration kind."""
    def generate(self):
        prompt = self.spec.get('prompt', 'No prompt provided.')
        output_spec = self.spec.get('output', {})
        output_path = output_spec.get('path')

        if not output_path:
            click.echo(f"Error: TextGeneration resource '{self.metadata.get('name')}' is missing spec.output.path.", err=True)
            return

        full_output_path = os.path.join(self.output_dir, output_path)
        
        click.echo(f"-> Generating Text for '{self.metadata.get('name')}'...")
        
        # This is a mock generation. In the future, we will call an LLM here.
        content = f'''--- MOCK GENERATED CONTENT ---
Prompt: "{prompt}"
'''
        
        # Ensure the directory for the output file exists
        os.makedirs(os.path.dirname(full_output_path), exist_ok=True)

        with open(full_output_path, 'w') as f:
            f.write(content)
            
        click.echo(f"   - Saved to: {full_output_path}")
