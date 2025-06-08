import yaml
import importlib
from rich.console import Console
from rich.panel import Panel
from rich.text import Text

def main():
    """
    The main entry point for the VibeCheck application.
    """
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

    # Run modules
    if "modules" in config:
        for module_name, module_config in config["modules"].items():
            console.print(f"\n[bold cyan]Running module: {module_name}[/bold cyan]")
            for check_name, check_config in module_config.items():
                if check_config.get("enabled", False):
                    try:
                        module_path = f"vibecheck.modules.{module_name}.{check_name}"
                        check_module = importlib.import_module(module_path)
                        check_module.run(console, check_config)
                    except ImportError:
                        console.print(f"[bold red]Error: Could not import module {module_path}[/bold red]")
                    except Exception as e:
                        console.print(f"[bold red]Error running check {check_name}: {e}[/bold red]")

if __name__ == "__main__":
    main()
