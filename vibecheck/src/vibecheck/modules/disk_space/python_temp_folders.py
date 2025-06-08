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
    Finds and calculates the size of Python temporary folders.
    """
    if verbose:
        console.print("[bold green]Checking for Python temporary folders...[/bold green]")

    if cached_data:
        if verbose: console.print("✅ Using cached data.")
        data = cached_data.get("data", {})
        total_size = data.get("total_size", 0)
        found_folders = data.get("found_folders", [])
    else:
        start_path = Path.home() / "git"
        found_folders = []
        total_size = 0
        for folder_name in ["__pycache__", ".venv"]:
            for path in start_path.rglob(f"**/{folder_name}"):
                if path.is_dir():
                    size = get_dir_size(path)
                    total_size += size
                    found_folders.append({"path": str(path), "size": size})

    summary = f"Found {len(found_folders)} Python temp folders, total size: [bold yellow]{total_size / (1024*1024):.2f} MB[/bold yellow]"
    
    if verbose:
        console.print(summary)

    return {
        "summary": summary,
        "status": "info",
        "data": {"total_size": total_size, "found_folders": found_folders}
    }

def cleanup(console, config, result):
    console.print("Cleanup for Python temp folders is not implemented yet.")
