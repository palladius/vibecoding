import platform
import subprocess
from rich.console import Console

from rich.prompt import Confirm

def run(console, config, verbose):
    """
    Checks the size of package manager caches.
    """
    return {"summary": "apt_size check is not yet implemented.", "status": "info"}

def cleanup(console, config, result):
    """
    Offers to clean up package manager caches.
    """
    followup_action = config.get("followup_action", "disabled")
    if followup_action == "disabled":
        return

    system = platform.system()
    command = ""
    if system == "Linux":
        command = "sudo apt-get autoremove -y"
    elif system == "Darwin":
        command = "brew cleanup"

    if not command:
        return

    if followup_action == "auto-accept":
        do_cleanup = True
    else: # prompt-user
        do_cleanup = Confirm.ask(f"Run `{command}`?")

    if do_cleanup:
        try:
            console.print(f"Running `{command}`...")
            # We use shell=True here because of sudo and potential user interaction
            subprocess.run(command, shell=True, check=True)
            console.print("✅ Cleanup complete.")
        except (subprocess.CalledProcessError, FileNotFoundError) as e:
            console.print(f"[bold red]Error running cleanup: {e}[/bold red]")
