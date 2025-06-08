from pathlib import Path
from rich.console import Console
from rich.table import Table

def run(console, config, verbose, cached_data=None):
    """
    Checks if a list of specified repository paths exist.
    """
    if not config or "repositories" not in config:
        return {"summary": "[red]Error: 'repositories' not specified in config.[/red]", "status": "error"}

    repos = config.get("repositories", [])
    all_exist = True
    
    if verbose:
        console.print("[bold green]Asserting repository paths exist...[/bold green]")
        table = Table(title="Repository Checks")
        table.add_column("Description", style="cyan")
        table.add_column("Path", style="magenta")
        table.add_column("Status", style="green")

    for repo in repos:
        path_str = repo.get("path")
        description = repo.get("description", "N/A")
        path = Path(path_str).expanduser()
        
        if path.exists():
            status = "✅ Exists"
            if verbose:
                table.add_row(description, str(path), status)
        else:
            all_exist = False
            status = f"❌ Missing"
            if verbose:
                table.add_row(description, str(path), status)

    if verbose:
        console.print(table)

    if all_exist:
        summary = "✅ All repository paths exist."
        status = "success"
    else:
        summary = "❌ Some repository paths are missing."
        status = "error"

    return {"summary": summary, "status": status}
