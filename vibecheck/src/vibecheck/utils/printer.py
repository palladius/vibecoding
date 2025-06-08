from rich.console import Console

def print_summary(console: Console, check_name: str, result: dict):
    """
    Prints a formatted summary of a check's result.
    """
    status = result.get("status", "info")
    emoji = "✅" if status in ["success", "info"] else "❌"
    
    console.print(f"  {emoji} [purple]{check_name}[/purple]: {result['summary']}")
