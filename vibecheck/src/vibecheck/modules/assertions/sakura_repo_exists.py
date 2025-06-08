from pathlib import Path
from rich.console import Console

def run(console, config, verbose, cached_data=None):
    """
    Checks if a specified path exists.
    """
    if not config or "path" not in config:
        return {"summary": "[red]Error: 'path' not specified in config.[/red]", "status": "error"}

    path_str = config.get("path")

    # Expand the tilde to the user's home directory
    path = Path(path_str).expanduser()

    if verbose:
        console.print(f"[bold green]Asserting path exists: {path}[/bold green]")

    if path.exists():
        summary = f"Path exists: [cyan]{path}[/cyan]"
        status = "success"
        if verbose:
            console.print(f"✅ {summary}")
    else:
        summary = f"Path does not exist: [bold red]{path}[/bold red]"
        status = "error"
        if verbose:
            console.print(f"❌ {summary}")

    return {"summary": summary, "status": status}
