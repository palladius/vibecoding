import click
import os
from . import parser
from . import engine

@click.group()
def cli():
    """A tool to declaratively generate multimedia assets."""
    pass

@cli.command()
@click.option('-f', '--file', 'filepath', type=click.Path(exists=True, file_okay=True, dir_okay=True, readable=True), required=True, help='The YAML file or directory to apply.')
@click.option('--output-dir', default='out/', help='The directory to save the generated assets.')
def apply(filepath, output_dir):
    """Apply a configuration from a YAML file or directory."""
    click.echo(f"Applying from path: {filepath}")

    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        click.echo(f"Created output directory: {output_dir}")

    try:
        documents = []
        if os.path.isfile(filepath):
            documents.extend(parser.parse_manifest(filepath))
        elif os.path.isdir(filepath):
            for root, _, files in os.walk(filepath):
                for f in sorted(files):
                    if f.endswith(('.yaml', '.yml')):
                        manifest_path = os.path.join(root, f)
                        click.echo(f"- Found manifest: {manifest_path}")
                        documents.extend(parser.parse_manifest(manifest_path))

        if not documents:
            click.echo("No YAML files found in the specified path.", err=True)
            return

        e = engine.Engine(output_dir=output_dir)
        e.run(documents)

    except Exception as e:
        click.echo(f"An error occurred: {e}", err=True)


if __name__ == '__main__':
    cli()
