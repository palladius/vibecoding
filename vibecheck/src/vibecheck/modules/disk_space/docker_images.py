import os
import docker
from pathlib import Path
from rich.console import Console
from rich.table import Table
from rich.prompt import Confirm

def get_docker_client(console, verbose=False):
    """
    Initializes and returns a Docker client, trying multiple connection methods.
    """
    # 1. Try Rancher Desktop's socket path first
    rancher_socket_path = Path.home() / ".rd" / "docker.sock"
    if rancher_socket_path.exists():
        try:
            if verbose: console.print("Attempting to connect via Rancher Desktop socket...")
            client = docker.DockerClient(base_url=f"unix://{rancher_socket_path}")
            client.ping() # Verify the connection
            if verbose: console.print("✅ Connected to Docker via Rancher Desktop socket.")
            return client
        except docker.errors.DockerException:
            if verbose: console.print("[yellow]Rancher socket found, but connection failed. Trying other methods...[/yellow]")

    # 2. Try the default from_env() method (checks DOCKER_HOST and default sockets)
    try:
        if verbose: console.print("Attempting to connect using default Docker environment...")
        client = docker.from_env()
        client.ping()
        if verbose: console.print("✅ Connected to Docker via default environment.")
        return client
    except docker.errors.DockerException:
        if verbose: console.print("[yellow]Could not connect using default environment.[/yellow]")

    return None

def run(console, config, verbose):
    """
    The main function for the docker_images check.
    """
    if verbose:
        console.print("[bold green]Running docker_images check...[/bold green]")

    client = get_docker_client(console, verbose)
    if not client:
        if verbose:
            console.print("[bold red]Error: Could not connect to Docker.[/bold red]")
        return {"summary": "Could not connect to Docker.", "status": "error"}

    try:
        images = client.images.list()
    except docker.errors.DockerException as e:
        if verbose:
            console.print(f"[bold red]Error listing Docker images: {e}[/bold red]")
        return {"summary": f"Error listing Docker images: {e}", "status": "error"}

    if not images:
        if verbose:
            console.print("No Docker images found. ✨")
        return {"summary": "No images found.", "status": "info"}

    total_size = sum(image.attrs['Size'] for image in images)
    summary = f"Found {len(images)} images, total size: [bold yellow]{total_size / (1024*1024):.2f} MB[/bold yellow]"

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

            table.add_row(repo, tag_str, f"{size / (1024*1024):.2f} MB")
        
        console.print(table)
        console.print(f"Total size of all images: [bold yellow]{total_size / (1024*1024):.2f} MB[/bold yellow]")

    images_data = []
    for image in images:
        images_data.append({
            'tags': image.tags,
            'size': image.attrs['Size']
        })

    return {"summary": summary, "status": "info", "data": images_data}

def cleanup(console, config, result):
    """
    Offers to prune dangling Docker images.
    """
    followup_action = config.get("followup_action", "disabled")
    if followup_action == "disabled":
        return

    client = get_docker_client(console)
    if not client:
        console.print("[bold red]Error: Could not connect to Docker for cleanup.[/bold red]")
        return

    if followup_action == "auto-accept":
        do_prune = True
    else: # prompt-user
        do_prune = Confirm.ask("Prune dangling Docker images?")

    if do_prune:
        try:
            console.print("Pruning dangling images...")
            pruned_images = client.images.prune(filters={'dangling': True})
            reclaimed_space = pruned_images.get('SpaceReclaimed', 0)
            if reclaimed_space:
                console.print(f"✅ Pruned. Reclaimed space: {reclaimed_space / 1024 / 1024:.2f} MB")
            else:
                console.print("No dangling images to prune.")
        except docker.errors.APIError as e:
            console.print(f"[bold red]Error pruning Docker images: {e}[/bold red]")