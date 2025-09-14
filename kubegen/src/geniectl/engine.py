import click
from graphlib import TopologicalSorter, CycleError
from .kinds.text import TextGenerationHandler

# Handler registry maps Kind names to their handler classes
HANDLER_REGISTRY = {
    "TextGeneration": TextGenerationHandler,
    # "AudioGeneration": AudioGenerationHandler,
}

class Engine:
    def __init__(self, output_dir):
        self.output_dir = output_dir
        self.resources = {}

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
        
        graph = TopologicalSorter()
        for key, doc in self.resources.items():
            graph.add(key)
            dependencies = self._get_dependencies(doc)
            for dep_key in dependencies:
                if dep_key in self.resources:
                    graph.add(dep_key, key)
        return graph

    def run(self, documents):
        click.echo("--- Starting Engine: Building Dependency Graph ---")
        try:
            graph = self._build_graph(documents)
            execution_order = list(graph.static_order())
        except CycleError as e:
            click.echo(f"Error: A dependency cycle was detected in your manifests: {e}", err=True)
            return

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
                handler = handler_class(doc, self.output_dir)
                handler.generate()
        click.echo("--------------------------")

        click.echo("\n--- Engine Finished ---")
