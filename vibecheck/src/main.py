import yaml
import importlib
import argparse
from rich.console import Console
from rich.panel import Panel
from rich.text import Text
from vibecheck.utils.cache import get_cache, set_cache, clear_cache

import datetime

import re

def clean_rich_text(text):
    """
    Removes rich-style formatting tags from a string.
    """
    return re.sub(r"\[.*?\]", "", text)

from pathlib import Path

def write_markdown_report(results, output_folder):
    """
    Writes the collected results to a markdown file.
    """
    output_path = Path(output_folder)
    output_path.mkdir(parents=True, exist_ok=True)
    
    today = datetime.date.today().strftime("%Y%m%d")
    filename = output_path / f"output-{today}.md"
    
    with open(filename, "w") as f:
        f.write("# VibeCheck Report\n\n")

        # Overall Disk Usage Summary
        if "disk_space" in results and "overall_disk_usage" in results["disk_space"]:
            usage_result = results["disk_space"]["overall_disk_usage"]
            f.write(f"## 💾 Overall Disk Usage\n\n")
            f.write(f"> {clean_rich_text(usage_result['summary'])}\n\n")

        for module_name, checks in results.items():
            f.write(f"## {module_name.replace('_', ' ').title()}\n\n")
            for check_name, result in checks.items():
                # Skip overall_disk_usage here as it's already displayed
                if check_name == 'overall_disk_usage':
                    continue

                status = result.get("status", "info")
                emoji = "✅" if status == "success" else "❌" if status == "error" else "➡️"
                summary = clean_rich_text(result['summary'])
                f.write(f"- **{check_name.replace('_', ' ').title()}**: {emoji} {summary}\n")

                # Detailed lists for specific checks
                if check_name == 'repos_exist' and result.get("data"):
                    for repo in result["data"]:
                        f.write(f"  - `{repo['path']}`: {repo['description']}\n")
                elif check_name == 'node_modules' and result.get("data"):
                    # Sort by size for the report
                    sorted_dirs = sorted(result["data"], key=lambda d: d['size'], reverse=True)
                    for dir_info in sorted_dirs:
                        if dir_info['size'] > 0:
                            size_mb = dir_info['size'] / (1024 * 1024)
                            f.write(f"  - `{dir_info['path']}` ({size_mb:.2f} MB)\n")
            f.write("\n")

def main():
    """
    The main entry point for the VibeCheck application.
    """
    parser = argparse.ArgumentParser(description="VibeCheck - A system health checker.")
    parser.add_argument("-v", "--verbose", action="store_true", help="Enable verbose output.")
    parser.add_argument("--run-cleanup", action="store_true", help="Run cleanup actions.")
    parser.add_argument("--no-cache", action="store_true", help="Disable caching for this run.")
    args = parser.parse_args()

    console = Console()
    console.print(Panel(Text("VibeCheck", justify="center", style="bold magenta")))

    # Handle cache clearing
    if args.no_cache:
        console.print("[bold yellow]Cache is disabled for this run.[/bold yellow]")
        clear_cache()
        console.print("✅ Cache cleared.")

    # Load configuration
    try:
        with open("config.yaml", "r") as f:
            config = yaml.safe_load(f)
        console.print("✅ Configuration loaded.")
    except FileNotFoundError:
        console.print("[bold red]Error: config.yaml not found.[/bold red]")
        return
    except yaml.YAMLError as e:
        console.print(f"[bold red]Error parsing config.yaml: {e}[/bold red]")
        return

    cache_duration = config.get("cache_duration", 86400)
    output_folder = config.get("output_folder", "./reports")
    all_results = {}

    # Run the overall disk usage check first and display it
    try:
        disk_module = importlib.import_module("vibecheck.modules.disk_space.overall_disk_usage")
        disk_result = disk_module.run(console, {}, False) # Not verbose, no cache
        if disk_result and disk_result.get("summary"):
            console.print(f"[bold cyan]Overall Disk Usage:[/] {disk_result['summary']}")
    except (ImportError, Exception) as e:
        console.print(f"[bold red]Could not run overall disk usage check: {e}[/bold red]")

    # Run modules
    if "modules" in config:
        for module_name, module_config in config["modules"].items():
            console.print(f"\n[bold cyan]Running module: {module_name}[/bold cyan]")
            all_results[module_name] = {}
            for check_name, check_config in module_config.items():
                if check_config.get("enabled", False):
                    cache_key = f"{module_name}.{check_name}"
                    result = None

                    # Caching logic
                    cached_data = None
                    if not args.no_cache:
                        cached_data = get_cache(cache_key, duration=cache_duration)
                    
                    try:
                        module_path = f"vibecheck.modules.{module_name}.{check_name}"
                        check_module = importlib.import_module(module_path)
                        
                        # Pass down verbosity, config, and cached data
                        result = check_module.run(console, check_config, args.verbose, cached_data)
                        
                        # If the check was run (no cache), store the new result.
                        if cached_data is None and result and "summary" in result:
                            set_cache(cache_key, result)

                    except ImportError:
                        console.print(f"[bold red]Error: Could not import module {module_path}[/bold red]")
                        result = None # Ensure result is None on error
                    except Exception as e:
                        console.print(f"[bold red]Error running check {check_name}: {e}[/bold red]")
                        result = None # Ensure result is None on error
                    
                    if result:
                        all_results[module_name][check_name] = result
                        if not args.verbose:
                             console.print(f"  - {check_name}: {result['summary']}")

    # Run cleanup actions if requested
    if args.run_cleanup:
        console.print("\n[bold yellow]Running cleanup actions...[/bold yellow]")
        for module_name, checks in all_results.items():
            for check_name, result in checks.items():
                module_path = f"vibecheck.modules.{module_name}.{check_name}"
                check_module = importlib.import_module(module_path)
                if hasattr(check_module, "cleanup"):
                    check_module.cleanup(console, config["modules"][module_name][check_name], result)

    write_markdown_report(all_results, output_folder)
    console.print(f"\n[bold green]✅ Markdown report generated in '{output_folder}'.[/bold green]")

    if not args.run_cleanup:
        total_savings = 0
        for module_name, checks in all_results.items():
            for check_name, result in checks.items():
                if result and result.get("data") and "total_size" in result["data"]:
                    total_savings += result["data"]["total_size"]
        
        if total_savings > 0:
            savings_mb = total_savings / (1024 * 1024)
            console.print(f"\n[bold yellow]You can save up to {savings_mb:.2f} MB of disk space.[/bold yellow]")
        console.print("\nTo run cleanup actions, use: [bold cyan]just cleanup[/bold cyan]")

if __name__ == "__main__":
    main()
