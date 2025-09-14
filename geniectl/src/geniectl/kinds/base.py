from abc import ABC, abstractmethod
import click

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