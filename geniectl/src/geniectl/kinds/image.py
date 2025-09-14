import click
from .base import BaseHandler

class ImageGenerationHandler(BaseHandler):
    """Handler for the ImageGeneration kind."""

    def _generate_native(self):
        click.echo("   - Error: The 'Native' engine for ImageGeneration is not implemented yet.", err=True)

    def _generate_geminicli(self):
        click.echo("   - Error: The 'GeminiCLI' engine for ImageGeneration is not implemented yet.", err=True)

    def _generate_mcp(self):
        click.echo("   - Error: The 'MCP' engine for ImageGeneration is not implemented yet.", err=True)