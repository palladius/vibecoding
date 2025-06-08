from pathlib import Path
from rich.console import Console
import os

def get_dir_size(path):
    total = 0
    try:
        for entry in os.scandir(path):
            try:
                if entry.is_dir(follow_symlinks=False):
                    total += get_dir_size(entry.path)
                elif entry.is_file(follow_symlinks=False):
                    total += entry.stat().st_size
            except OSError:
                continue
    except FileNotFoundError:
        return 0
    return total

def run(console, config, verbose, cached_data=None):
    """
    Finds and calculates the size of folders based on a list of patterns.
    """
    folder_patterns = config.get("folder_patterns", [])
    check_name = config.get("name", "Folder Scan") # Get a display name from config

    if verbose:
        console.print(f"[bold green]Scanning for {check_name}...[/bold green]")

    if cached_data:
        if verbose: console.print("✅ Using cached data.")
        data = cached_data.get("data", {})
        total_size = data.get("total_size", 0)
        found_folders = data.get("found_folders", [])
    else:
        start_path = Path(config.get("start_path", "~/git")).expanduser()
        found_folders = []
        total_size = 0
        for pattern in folder_patterns:
            for path in start_path.rglob(pattern):
                if path.is_dir():
                    size = get_dir_size(path)
                    total_size += size
                    found_folders.append({"path": str(path), "size": size})

    summary = f"Found {len(found_folders)} {check_name} folders, total size: [bold yellow]{total_size / (1024*1024):.2f} MB[/bold yellow]"
    
    if verbose:
        console.print(summary)

    return {
        "summary": summary,
        "status": "info",
        "data": {"total_size": total_size, "found_folders": found_folders}
    }

def cleanup(console, config, result):
    console.print(f"Cleanup for {config.get('name', 'folders')} is not implemented yet.")
