import platform
import subprocess
from pathlib import Path
from rich.console import Console
from rich.table import Table

def run(console, config, verbose, cached_data=None):
    """
    Checks if a list of specified applications exist.
    """
    if not config or "applications" not in config:
        return {"summary": "[red]Error: 'applications' not specified in config.[/red]", "status": "error"}

    apps_to_check = config.get("applications", [])
    all_found = True
    results = []

    if verbose:
        console.print("[bold green]Asserting application existence...[/bold green]")
        table = Table(title="Application Checks")
        table.add_column("Application Name", style="cyan")
        table.add_column("Check Method", style="magenta")
        table.add_column("Status", style="green")

    for app in apps_to_check:
        app_name = app.get("name")
        found = False
        method = ""

        system = platform.system()
        if system == "Darwin":
            path_str = app.get("macos_path", f"/Applications/{app_name}.app")
            method = f"Path: {path_str}"
            # Use subprocess to get around sandbox limitations
            process = subprocess.run(["test", "-d", path_str], capture_output=True)
            if process.returncode == 0:
                found = True
        elif system == "Linux":
            executable = app.get("linux_executable", app_name.lower())
            method = f"Executable: {executable}"
            # Use subprocess for consistency
            process = subprocess.run(["which", executable], capture_output=True)
            if process.returncode == 0:
                found = True
        
        results.append({"name": app_name, "found": found, "method": method})
        if not found:
            all_found = False

        if verbose:
            status = "✅ Found" if found else "❌ Missing"
            table.add_row(app_name, method, status)

    if verbose:
        console.print(table)

    if all_found:
        summary = "✅ All required applications are installed."
        status = "success"
    else:
        summary = "❌ Some required applications are missing."
        status = "error"

    return {"summary": summary, "status": status, "data": results}
