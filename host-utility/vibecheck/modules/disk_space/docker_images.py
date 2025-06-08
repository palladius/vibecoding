import docker
from rich.console import Console
from rich.table import Table

def run(console, config):
    """
    The main function for the docker_images check.
    """
    console.print("[bold green]Running docker_images check...[/bold green]")

    try:
        client = docker.from_env()
        images = client.images.list()
    except docker.errors.DockerException:
        console.print("[bold red]Error: Docker is not running.[/bold red]")
        return

    if not images:
        console.print("No Docker images found. ✨")
        return

    table = Table(title="Docker Image Analysis")
    table.add_column("Repository", justify="left", style="cyan", no_wrap=True)
    table.add_column("Tag", justify="left", style="green")
    table.add_column("Size", justify="right", style="magenta")

    total_size = 0
    for image in images:
        size = image.attrs['Size']
        total_size += size
        repo_tags = image.tags if image.tags else ["<none>"]
        for tag in repo_tags:
            repo, tag_str = tag.split(':') if ':' in tag else (tag, '<none>')
            table.add_row(repo, tag_str, f"{size / 1024 / 1024:.2f} MB")

    console.print(table)
    console.print(f"Total size of all images: [bold yellow]{total_size / 1024 / 1024:.2f} MB[/bold yellow]")
