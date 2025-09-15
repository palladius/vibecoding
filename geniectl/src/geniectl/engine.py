import click
import yaml
import os
import re
import subprocess
from pathlib import Path
from graphlib import TopologicalSorter, CycleError
from .kinds.text import TextGenerationHandler
from .kinds.audio import AudioGenerationHandler
from .kinds.gemini_cli import GeminiCLI
from .kinds.image import ImageGenerationHandler

# Handler registry maps Kind names to their handler classes
HANDLER_REGISTRY = {
    "TextGeneration": TextGenerationHandler,
    "AudioGeneration": AudioGenerationHandler,
    "ImageGeneration": ImageGenerationHandler,
    "GeminiCLI": GeminiCLI,
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

    def _substitute_variables(self, text):
        pattern = r'\$\{([^}]+)\}'

        def replace_func(match):
            var_path = match.group(1)
            parts = var_path.split('.')
            if len(parts) != 3 or parts[1] != 'output':
                return match.group(0) # Return original if format is not supported

            resource_key = parts[0]
            field = parts[2]

            dep_doc = self.resources.get(resource_key)
            if not dep_doc:
                return match.group(0)

            output_path = dep_doc.get('spec', {}).get('output', {}).get('path')
            if not output_path:
                return match.group(0)

            full_output_path = os.path.join(self.output_dir, output_path)

            if field == 'path':
                return full_output_path
            elif field == 'content':
                if not os.path.exists(full_output_path):
                    # This should be caught by the dependency check, but as a safeguard:
                    raise Exception(f"Dependency output file not found: {full_output_path}")
                with open(full_output_path, 'r') as f:
                    return f.read()
            else:
                return match.group(0) # Unsupported field

        return re.sub(pattern, replace_func, text)

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

    def run(self, documents, dry_run=False):
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
        
        ENGINE_EMOJIS = {
            "Native": "🐍",
            "GeminiCLI": "♊",
            "MCP": "🌐",
        }

        for key in execution_order:
            doc = self.resources[key]
            spec = doc.get('spec', {})
            kind = doc.get('kind', 'Unknown')
            engine = spec.get('engine', 'Native') # Default to Native
            engine_emoji = ENGINE_EMOJIS.get(engine, "❓")
            
            api_version = doc.get('apiVersion', 'Unknown')
            dependencies = self._get_dependencies(doc)
            dep_string = f" -> depends on [{ ', '.join(dependencies) }]" if dependencies else ""

            output_path = spec.get('output', {}).get('path')
            full_output_path = os.path.join(self.output_dir, output_path) if output_path else None

            replicas = spec.get('replicas')
            replica_display = f" (x{replicas})" if replicas and replicas > 1 else ""

            output_filename_display = ""
            if output_path:
                if replicas and replicas > 1:
                    p = Path(output_path)
                    base_name = p.stem
                    extension = p.suffix
                    output_filename_display = f"💾 {base_name}_{{1..{replicas}}}{extension}"
                else:
                    output_filename_display = f"💾 {output_path}"

            # Determine output file status emoji and color
            output_file_status_emoji = ''
            output_color = 'white' # Default
            existing_count = 0
            if output_path:
                if replicas and replicas > 1:
                    p = Path(output_path)
                    base_name = p.stem
                    extension = p.suffix
                    replica_files = [os.path.join(self.output_dir, f"{base_name}_{i}{extension}") for i in range(1, replicas + 1)]
                    existing_count = sum(1 for f in replica_files if os.path.exists(f))

                    if existing_count == replicas:
                        output_file_status_emoji = '✅'
                        output_color = 'green'
                    elif existing_count > 0:
                        output_file_status_emoji = '⚠️'
                        output_color = 'yellow'
                    else:
                        output_file_status_emoji = '❌'
                        output_color = 'blue'
                elif full_output_path and os.path.exists(full_output_path):
                    output_file_status_emoji = '✅'
                    output_color = 'green'
                else:
                    output_file_status_emoji = '❌'
                    output_color = 'blue'

            # Determine step status
            status = "🟢"
            status_text = "Ready to go"

            if api_version.split('/')[0] != 'kine-matic.io':
                status = "🔴"
                status_text = f"Unknown apiVersion '{api_version}''"
            elif kind not in HANDLER_REGISTRY:
                status = "🔴"
                status_text = "Handler not implemented"
            elif output_path:
                if replicas and replicas > 1:
                    if existing_count == replicas:
                        status = "⚪️"
                        status_text = "Done (all files exist)"
                    elif existing_count > 0:
                        status = "🟠"
                        status_text = f"Partially done ({existing_count}/{replicas} exist)"
                elif full_output_path and os.path.exists(full_output_path):
                    status = "⚪️"
                    status_text = "Done (file already exists)"

            # Check dependencies
            if status in ["🟢", "🟠"]:
                for dep_key in dependencies:
                    dep_doc = self.resources.get(dep_key)
                    if not dep_doc:
                        status = "🟡"
                        status_text = f"Unsatisfied dependency: {dep_key} (not found)"
                        break
                    
                    dep_output_path = dep_doc.get('spec', {}).get('output', {}).get('path')
                    if not dep_output_path:
                        # This case should ideally be caught by a validator
                        continue

                    # Check if dependency is fully satisfied
                    dep_replicas = dep_doc.get('spec', {}).get('replicas')
                    if dep_replicas and dep_replicas > 1:
                        p = Path(dep_output_path)
                        base_name = p.stem
                        extension = p.suffix
                        dep_files = [os.path.join(self.output_dir, f"{base_name}_{i}{extension}") for i in range(1, dep_replicas + 1)]
                        if not all(os.path.exists(f) for f in dep_files):
                            status = "🟡"
                            status_text = f"Unsatisfied dependency: {dep_key} (outputs not found)"
                            break
                    else:
                        dep_full_output_path = os.path.join(self.output_dir, dep_output_path)
                        if not os.path.exists(dep_full_output_path):
                            status = "🟡"
                            status_text = f"Unsatisfied dependency: {dep_key} (output not found)"
                            break
            
            key_styled = click.style(f"{key}{replica_display}", fg='bright_cyan', bold=True)
            output_display_styled = click.style(output_filename_display, fg=output_color)

            click.echo(f"{status} {engine_emoji} {key_styled} {dep_string} {output_file_status_emoji} {output_display_styled} ({status_text})")

        click.echo("----------------------")

        if dry_run:
            click.echo("\n--- Dry Run Finished ---")
            return

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
                # Substitute variables in the prompt
                prompt = doc.get('spec', {}).get('prompt')
                if prompt:
                    doc['spec']['prompt'] = self._substitute_variables(prompt)

                # Pass the full resource map and config to the handler
                handler = handler_class(doc, self.output_dir, self.resources, self.config)
                handler.generate()
                handler._post_generate_check()

                # Verification Step
                output_path = doc.get('spec', {}).get('output', {}).get('path')
                if output_path:
                    replicas = doc.get('spec', {}).get('replicas')
                    if replicas and replicas > 1:
                        p = Path(output_path)
                        base_name = p.stem
                        extension = p.suffix
                        expected_files = [os.path.join(self.output_dir, f"{base_name}_{i}{extension}") for i in range(1, replicas + 1)]
                        
                        for f_path in expected_files:
                            if not os.path.exists(f_path):
                                click.echo(f"   - ❌ Error: Expected output file was not created: {f_path}", err=True)
                    else:
                        full_output_path = os.path.join(self.output_dir, output_path)
                        if not os.path.exists(full_output_path):
                            click.echo(f"   - ❌ Error: Expected output file was not created: {full_output_path}", err=True)
        click.echo("--------------------------")

        click.echo("\n--- Engine Finished ---")
