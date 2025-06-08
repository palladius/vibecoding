import os
import docker
from pathlib import Path
from rich.console import Console
from rich.table import Table

def get_docker_client(console):
    """
    Initializes and returns a Docker client, trying multiple connection methods.
    """
    # 1. Try Rancher Desktop's socket path first
    rancher_socket_path = Path.home() / ".rd" / "docker.sock"
    if rancher_socket_path.exists():
        try:
            console.print("Attempting to connect via Rancher Desktop socket...")
            client = docker.DockerClient(base_url=f"unix://{rancher_socket_path}")
            client.ping() # Verify the connection
            console.print("✅ Connected to Docker via Rancher Desktop socket.")
            return client
        except docker.errors.DockerException:
            console.print("[yellow]Rancher socket found, but connection failed. Trying other methods...[/yellow]")

    # 2. Try the default from_env() method (checks DOCKER_HOST and default sockets)
    try:
        console.print("Attempting to connect using default Docker environment...")
        client = docker.from_env()
        client.ping()
        console.print("✅ Connected to Docker via default environment.")
        return client
    except docker.errors.DockerException:
        console.print("[yellow]Could not connect using default environment.[/yellow]")

    return None

def run(console, config, verbose):
    """
    The main function for the docker_images check.
    """
    if verbose:
        console.print("[bold green]Running docker_images check...[/bold green]")

    client = get_docker_client(console) if verbose else None
    if verbose and not client:
        console.print("[bold red]Error: Could not connect to Docker.[/bold red]")
        return None

    try:
        images = client.images.list() if client else []
    except docker.errors.DockerException as e:
        if verbose:
            console.print(f"[bold red]Error listing Docker images: {e}[/bold red]")
        return None

    if not images:
        if verbose:
            console.print("No Docker images found. ✨")
        return {"summary": "No images found."}

    total_size = sum(image.attrs['Size'] for image in images)
    summary = f"Found {len(images)} images, total size: [bold yellow]{total_size / 1024 / 1024:.2f} MB[/bold yellow]"

    if verbose:
        table = Table(title="Docker Image Analysis", row_styles=["", "dim"])
        table.add_column("Repository", justify="left", style="cyan", no_wrap=True, max_width=60)
        table.add_column("Tag", justify="left", style="green", no_wrap=True)
        table.add_column("Size", justify="right", style="magenta", no_wrap=True)

        for image in images:
            size = image.attrs['Size']
            repo_tags = image.tags if image.tags else ["<none>"]
            first_tag = repo_tags[0]
            repo, tag_str = first_tag.split(':') if ':' in first_tag else (first_tag, '<none>')
            
            if len(repo_tags) > 1:
                repo = f"{repo} (+{len(repo_tags) - 1} more)"

            table.add_row(repo, tag_str, f"{size / 1024 / 1024:.2f} MB")
        
        console.print(table)
        console.print(f"Total size of all images: [bold yellow]{total_size / 1024 / 1024:.2f} MB[/bold yellow]")
    else:
        console.print(f"  - docker_images: {summary}")

    return {"summary": summary, "data": images}
