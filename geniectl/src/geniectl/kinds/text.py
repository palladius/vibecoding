import os
import click
import google.generativeai as genai
from .base import BaseHandler

class TextGenerationHandler(BaseHandler):
    """Handler for the TextGeneration kind."""

    def __init__(self, doc, output_dir, all_resources, config):
        super().__init__(doc, output_dir, all_resources, config)
        # Configure the API. The API key is automatically picked up from the
        # GOOGLE_API_KEY environment variable. For Vertex AI, ADC is used.
        try:
            genai.configure()
        except Exception as e:
            click.echo(f"Error configuring Generative AI: {e}", err=True)

    def generate(self):
        output_spec = self.spec.get('output', {})
        output_path = output_spec.get('path')

        if not output_path:
            click.echo(f"Error: TextGeneration resource '{self.metadata.get('name')}' is missing spec.output.path.", err=True)
            return

        full_output_path = os.path.join(self.output_dir, output_path)

        # 1. Idempotency Check
        if os.path.exists(full_output_path):
            click.echo(f"   - Skipping: File already exists at {full_output_path}")
            return
        click.echo(f"   - Executing: File DOES NOT exist at {full_output_path}")

        # 2. Model Configuration Logic
        default_model = self.config.get('defaults', {}).get('models', {}).get('TextGeneration', 'gemini-1.5-flash')
        model_name = self.spec.get('model', default_model)
        prompt = self.spec.get('prompt', 'No prompt provided.')

        click.echo(f"-> Generating Text for '{self.metadata.get('name')}' using {model_name}...")

        try:
            model = genai.GenerativeModel(model_name)
            response = model.generate_content(prompt)
            content = response.text
        except Exception as e:
            click.echo(f"   - Error calling Gemini API: {e}", err=True)
            content = f'--- ERROR DURING GENERATION ---\nPrompt: "{prompt}" \nError: {e}'

        os.makedirs(os.path.dirname(full_output_path), exist_ok=True)

        with open(full_output_path, 'w') as f:
            f.write(content)

        click.echo(f"   - Saved to: {full_output_path}")
