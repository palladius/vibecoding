import click
import yaml
import os
import subprocess
from graphlib import TopologicalSorter, CycleError
from .kinds.text import TextGenerationHandler
from .kinds.audio import AudioGenerationHandler

# Handler registry maps Kind names to their handler classes
HANDLER_REGISTRY = {
    "TextGeneration": TextGenerationHandler,
    "AudioGeneration": AudioGenerationHandler,
}

class Engine:
    def __init__(self, output_dir):
        self.output_dir = output_dir
        self.resources = {}
        self.config = self._load_config()

    def _load_config(self):
        try:
            with open('config.yaml', 'r') as f:
                return yaml.safe_load(f)
        except FileNotFoundError:
            click.echo("Warning: config.yaml not found. Using default settings.", err=True)
            return {}
        except yaml.YAMLError as e:
            click.echo(f"Warning: Error parsing config.yaml: {e}. Using default settings.", err=True)
            return {}

    def _get_resource_key(self, doc):
        kind = doc.get('kind')
        name = doc.get('metadata', {}).get('name')
        if not kind or not name:
            return None
        return f"{kind}/{name}"

    def _get_dependencies(self, doc):
        return doc.get('spec', {}).get('depends_on', [])

    def _build_graph(self, documents):
        self.resources = {self._get_resource_key(doc): doc for doc in documents if self._get_resource_key(doc)}
        
        graph_dict = {}
        for key, doc in self.resources.items():
            dependencies = self._get_dependencies(doc)
            graph_dict[key] = set(dependencies)
            
        ts = TopologicalSorter(graph_dict)
        return ts

    def _export_graph_to_dot(self):
        """Exports the dependency graph to a .dot file and generates a PNG."""
        dot_path = os.path.join(self.output_dir, "dependencies.dot")
        png_path = os.path.join(self.output_dir, "dependencies.png")

        with open(dot_path, 'w') as f:
            f.write("digraph dependencies {\n")
            f.write("  rankdir=LR;\n") # Left to right layout
            for key, doc in self.resources.items():
                f.write(f'  "{key}";\n')
                dependencies = self._get_dependencies(doc)
                for dep_key in dependencies:
                    f.write(f'  "{dep_key}" -> "{key}";\n')
            f.write("}\n")
        click.echo(f"--- Saved dependency graph to {dot_path} ---")

        # Attempt to generate PNG visualization
        try:
            subprocess.run(['dot', '-Tpng', dot_path, '-o', png_path], check=True)
            click.echo(f"--- Generated dependency graph PNG: {png_path} ---")
        except FileNotFoundError:
            click.echo("--- Warning: 'dot' command not found. Skipping PNG generation. ---", err=True)
            click.echo("--- To generate the PNG, install graphviz (e.g., 'brew install graphviz') ---", err=True)
        except subprocess.CalledProcessError as e:
            click.echo(f"--- Error generating PNG: {e} ---", err=True)

    def run(self, documents):
        click.echo("--- Starting Engine: Building Dependency Graph ---")
        try:
            graph = self._build_graph(documents)
            execution_order = list(graph.static_order())
        except CycleError as e:
            click.echo(f"Error: A dependency cycle was detected in your manifests: {e}", err=True)
            return

        # Export graph for visualization
        self._export_graph_to_dot()

        # --- Planning Phase ---
        click.echo("\n--- Execution Plan ---")
        for key in execution_order:
            doc = self.resources[key]
            kind = doc.get('kind', 'Unknown')
            api_version = doc.get('apiVersion', 'Unknown')
            dependencies = self._get_dependencies(doc)
            dep_string = f" -> depends on [{ ', '.join(dependencies) }]" if dependencies else ""

            if api_version.split('/')[0] != 'kine-matic.io':
                click.echo(f"🟡 Skipping {key}{dep_string} (unknown apiVersion '{api_version}')")
            elif kind not in HANDLER_REGISTRY:
                click.echo(f"🟡 Skipping {key}{dep_string} (handler not implemented)")
            else:
                click.echo(f"🟢 Running  {key}{dep_string}")
        click.echo("----------------------")

        # --- Execution Phase ---
        click.echo("\n--- Processing Resources ---")
        for key in execution_order:
            doc = self.resources[key]
            kind = doc.get('kind')
            api_version = doc.get('apiVersion', 'Unknown')

            if api_version.split('/')[0] != 'kine-matic.io':
                continue

            handler_class = HANDLER_REGISTRY.get(kind)
            if handler_class:
                # Pass the full resource map and config to the handler
                handler = handler_class(doc, self.output_dir, self.resources, self.config)
                handler.generate()
        click.echo("--------------------------")

        click.echo("\n--- Engine Finished ---")