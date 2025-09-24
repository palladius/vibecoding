import click
import os
import sys
from . import parser
from . import engine
from .exceptions import NotImplementedEngineError
from .samples import SAMPLE_STORY


@click.group()
def cli():
    """A tool to declaratively generate multimedia assets."""
    # Add ~/go/bin to the PATH for the gemini executable
    go_bin_path = os.path.expanduser('~/go/bin')
    if go_bin_path not in os.environ['PATH']:
        os.environ['PATH'] = f"{go_bin_path}:{os.environ['PATH']}"

@cli.command('generate-sample')
def generate_sample():
    """Generates a sample story YAML file."""
    with open('sample-story.yaml', 'w') as f:
        f.write(SAMPLE_STORY)
    click.echo("Generated sample-story.yaml")

@cli.command()
@click.option('-f', '--file', 'filepath', type=click.Path(exists=True, file_okay=True, dir_okay=True, readable=True), required=True, help='The YAML file or directory to apply.')
@click.option('-d', '--output-dir',  default='out/', help='The directory to save the generated assets.')
@click.option('--plan', '--dry-run', 'dry_run', is_flag=True, help='Show the execution plan without running it.')
@click.option('--verbose', is_flag=True, help='Enable verbose output.')
def apply(filepath, output_dir, dry_run, verbose):
    """Apply a configuration from a YAML file or directory."""
    click.echo(f"Applying from path: {filepath}")

    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        click.echo(f"📂 Created output directory: {output_dir}")
    else:
        click.echo(f"📂 Output directory: {output_dir}")

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
        e.run(documents, dry_run=dry_run)

    except NotImplementedEngineError:
        # Error message is printed in the handler. We just exit with the specific code.
        sys.exit(42)
    except Exception as e:
        click.echo(f"An error occurred: {e}", err=True)
        sys.exit(1)

@cli.command()
@click.option('-f', '--file', 'filepath', type=click.Path(exists=True, file_okay=True, dir_okay=True, readable=True), required=True, help='The YAML file or directory to evaluate.')
@click.option('--output-dir', default='out/', help='The directory where assets are located.')
def eval(filepath, output_dir):
    """Evaluate a configuration from a YAML file or directory."""
    click.echo(f"👀 Evaluating from path: {filepath}")
    click.echo(f"📂 Output directory: {output_dir}")

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
        e.run(documents, eval_only=True)

    except Exception as e:
        click.cho(f"An error occurred: {e}", err=True)
        sys.exit(1)



if __name__ == '__main__':
    cli()
