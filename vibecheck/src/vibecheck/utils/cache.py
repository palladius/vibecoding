import os
import time
import json
from pathlib import Path

CACHE_DIR = Path.home() / ".cache" / "vibecheck"
CACHE_DIR.mkdir(parents=True, exist_ok=True)

def get_cache(key, duration=86400):
    """
    Retrieves data from the cache if it's not expired.
    """
    cache_file = CACHE_DIR / f"{key}.json"
    if not cache_file.exists():
        return None

    try:
        with open(cache_file, "r") as f:
            data = json.load(f)
        
        if time.time() - data["timestamp"] > duration:
            return None # Cache expired
        
        return data["payload"]
    except (json.JSONDecodeError, KeyError):
        return None

def set_cache(key, payload):
    """
    Saves data to the cache.
    """
    cache_file = CACHE_DIR / f"{key}.json"
    data = {
        "timestamp": time.time(),
        "payload": payload
    }
    with open(cache_file, "w") as f:
        json.dump(data, f)

def clear_cache():
    """
    Clears the entire cache directory.
    """
    for item in CACHE_DIR.iterdir():
        item.unlink()
