import yaml
import importlib
import argparse
from rich.console import Console
from rich.panel import Panel
from rich.text import Text
from vibecheck.utils.cache import get_cache, set_cache

import datetime

import re

def clean_rich_text(text):
    """
    Removes rich-style formatting tags from a string.
    """
    return re.sub(r"\[.*?\]", "", text)

def write_markdown_report(results):
    """
    Writes the collected results to a markdown file.
    """
    today = datetime.date.today().strftime("%Y%m%d")
    filename = f"output-{today}.md"
    
    with open(filename, "w") as f:
        f.write("# VibeCheck Report\n\n")
        for module_name, checks in results.items():
            f.write(f"## {module_name.replace('_', ' ').title()}\n\n")
            for check_name, result in checks.items():
                status = result.get("status", "info")
                emoji = "✅" if status == "success" else "❌" if status == "error" else "➡️"
                summary = clean_rich_text(result['summary'])
                f.write(f"- **{check_name.replace('_', ' ').title()}**: {emoji} {summary}\n")
            f.write("\n")

def main():
    """
    The main entry point for the VibeCheck application.
    """
    parser = argparse.ArgumentParser(description="VibeCheck - A system health checker.")
    parser.add_argument("-v", "--verbose", action="store_true", help="Enable verbose output.")
    args = parser.parse_args()

    console = Console()
    console.print(Panel(Text("VibeCheck", justify="center", style="bold magenta")))

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
    all_results = {}

    # Run modules
    if "modules" in config:
        for module_name, module_config in config["modules"].items():
            console.print(f"\n[bold cyan]Running module: {module_name}[/bold cyan]")
            all_results[module_name] = {}
            for check_name, check_config in module_config.items():
                if check_config.get("enabled", False):
                    cache_key = f"{module_name}.{check_name}"
                    result = None
                    cached_data = get_cache(cache_key, duration=cache_duration)

                    if cached_data and not args.verbose:
                        result = cached_data
                    else:
                        try:
                            module_path = f"vibecheck.modules.{module_name}.{check_name}"
                            check_module = importlib.import_module(module_path)
                            
                            # Pass down verbosity and config
                            result = check_module.run(console, check_config, args.verbose)
                            
                            if result and "summary" in result:
                                set_cache(cache_key, result)

                        except ImportError:
                            console.print(f"[bold red]Error: Could not import module {module_path}[/bold red]")
                        except Exception as e:
                            console.print(f"[bold red]Error running check {check_name}: {e}[/bold red]")
                    
                    if result:
                        all_results[module_name][check_name] = result
                        if not args.verbose:
                             console.print(f"  - {check_name}: {result['summary']}")

    write_markdown_report(all_results)
    console.print("\n[bold green]✅ Markdown report generated.[/bold green]")

if __name__ == "__main__":
    main()
