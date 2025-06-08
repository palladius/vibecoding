import platform
import subprocess
from rich.console import Console
from rich.prompt import Confirm
from pathlib import Path
import os

def get_dir_size(path):
    """
    Recursively calculates the size of a directory.
    """
    total = 0
    # Use os.scandir for better performance
    try:
        for entry in os.scandir(path):
            try:
                if entry.is_dir(follow_symlinks=False):
                    total += get_dir_size(entry.path)
                elif entry.is_file(follow_symlinks=False):
                    total += entry.stat().st_size
            except OSError:
                # Ignore permission errors or broken symlinks
                continue
    except FileNotFoundError:
        return 0 # Path doesn't exist
    return total

def run(console, config, verbose, cached_data=None):
    """
    Checks the size of package manager caches.
    """
    if verbose:
        console.print("[bold green]Running apt/brew cache size check...[/bold green]")

    # Invalidate cache if it's from an old version (doesn't have the 'data' key)
    if cached_data and "data" not in cached_data:
        if verbose:
            console.print("[yellow]Old cache format detected. Forcing re-check.[/yellow]")
        cached_data = None

    if cached_data:
        if verbose:
            console.print("✅ Using cached data.")
        data = cached_data.get("data", {})
        size_bytes = data.get("size_bytes", 0)
        manager = data.get("manager", "Unknown")
    else:
        system = platform.system()
        size_bytes = 0
        manager = None

        if system == "Darwin":
            manager = "Homebrew"
            try:
                cache_path_str = subprocess.check_output(["brew", "--cache"], text=True, stderr=subprocess.PIPE).strip()
                cache_path = Path(cache_path_str)
                if verbose:
                    console.print(f"Found Homebrew cache path: [cyan]{cache_path}[/cyan]")
                if cache_path.is_dir():
                    size_bytes = get_dir_size(cache_path)
            except (subprocess.CalledProcessError, FileNotFoundError):
                return {"summary": "Homebrew not found or `brew --cache` failed.", "status": "error"}

        elif system == "Linux":
            manager = "apt"
            cache_path = Path("/var/cache/apt/archives")
            if verbose:
                console.print(f"Checking apt cache path: [cyan]{cache_path}[/cyan]")
            if cache_path.is_dir():
                size_bytes = get_dir_size(cache_path)
        else:
            return {"summary": f"Unsupported OS for this check: {system}", "status": "info"}

    if size_bytes > 0:
        size_mb = size_bytes / (1024 * 1024)
        summary = f"{manager} cache size: [bold yellow]{size_mb:.2f} MB[/bold yellow]"
    else:
        summary = f"{manager} cache is empty or not found."

    if verbose:
        console.print(summary)

    return {
        "summary": summary,
        "status": "info",
        "data": {"size_bytes": size_bytes, "manager": manager}
    }


def cleanup(console, config, result):
    """
    Offers to clean up package manager caches.
    """
    console.print("Cleanup for apt/brew is not implemented yet.")
