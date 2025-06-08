import psutil
import platform
from rich.console import Console

def run(console, config, verbose, cached_data=None):
    """
    Checks the overall disk usage of the main data partition.
    """
    if verbose:
        console.print("[bold green]Checking overall disk usage...[/bold green]")

    path_to_check = '/'
    if platform.system() == "Darwin":
        path_to_check = "/System/Volumes/Data"

    try:
        usage = psutil.disk_usage(path_to_check)
        total_gb = usage.total / (1024**3)
        used_gb = usage.used / (1024**3)
        free_gb = usage.free / (1024**3)
        percent_used = usage.percent

        status = "success"
        summary = f"Disk Usage ({path_to_check}): {used_gb:.2f}GB / {total_gb:.2f}GB ({percent_used}% used)"

        if percent_used > 90:
            status = "error"
            summary += " [bold red]⚠️ High usage![/bold red]"
        elif free_gb < 2:
            status = "warning"
            summary += " [bold yellow]⚠️ Low free space![/bold yellow]"

        if verbose:
            console.print(summary)

        return {
            "summary": summary,
            "status": status,
            "data": {
                "total_gb": total_gb,
                "used_gb": used_gb,
                "free_gb": free_gb,
                "percent_used": percent_used
            }
        }
    except FileNotFoundError:
        return {"summary": f"[red]Error: Path not found: {path_to_check}[/red]", "status": "error"}
