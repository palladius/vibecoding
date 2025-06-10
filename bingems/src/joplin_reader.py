import os
import sqlite3
import json
import subprocess
import argparse
import google.generativeai as genai
from datetime import datetime

# Configure the generative AI model to use Vertex AI
if os.environ.get("GOOGLE_GENAI_USE_VERTEXAI", "false").lower() == "true":
    # No explicit configuration needed for Vertex AI with Application Default Credentials
    pass
else:
    # Fallback to API key if not using Vertex AI
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY is not set. Please set it or use Vertex AI.")
    genai.configure(api_key=api_key)

# Check for GOOGLE_CLOUD_PROJECT if using Vertex AI
if os.environ.get("GOOGLE_GENAI_USE_VERTEXAI", "false").lower() == "true":
    if not os.environ.get("GOOGLE_CLOUD_PROJECT"):
        raise ValueError("GOOGLE_CLOUD_PROJECT is not set. Please set it when using Vertex AI.")

model = genai.GenerativeModel('gemini-1.5-flash')

def get_joplin_summary(query):
    """
    Summarizes Joplin notes from the 'salute' and 'Viaggi' folders.
    """
    # Connect to the Joplin database
    db_path = '/Users/ricc/git/vibecoding/vibecheck/etc/joplin.sqlite'
    conn = sqlite3.connect(db_path)
    c = conn.cursor()

    # Get the folder IDs
    c.execute("SELECT id FROM folders WHERE title IN ('salute', 'Viaggi')")
    folders = c.fetchall()
    folder_ids = [folder[0] for folder in folders]

    # Get the note titles and bodies
    c.execute(f"SELECT title, body FROM notes WHERE parent_id IN ({','.join(['?']*len(folder_ids))})", folder_ids)
    notes = c.fetchall()

    # Create the prompt
    prompt = f"""
    You are a helpful assistant. Your task is to answer the following query based on the provided Joplin notes.

    Query: {query}

    Here are the notes:
    """

    for title, body in notes:
        prompt += f"## {title}\n{body}\n\n"

    prompt += """
    Present the answer in a calendar style, with each event on a new line.
    The format should be:
    - DOW Mon Day: Event (Category)

    Where:
    - DOW is the 3-letter day of the week (e.g., Wed)
    - Mon is the 3-letter month (e.g., Jun)
    - Day is the day of the month (e.g., 18th)
    - Event is the name of the event.
    - Category is either (Work) or (Health).

    Do not include days with no events.
    Be as concise as possible.
    """


    # Generate content using the model
    response = model.generate_content(prompt)

    # Check if glow is installed
    try:
        subprocess.run(["which", "glow"], check=True, capture_output=True)
        glow_installed = True
    except (subprocess.CalledProcessError, FileNotFoundError):
        glow_installed = False

    if glow_installed:
        process = subprocess.run(["glow"], input=response.text, text=True, capture_output=True)
        print(process.stdout)
    else:
        print(response.text)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Summarize Joplin notes.")
    parser.add_argument(
        "--query",
        type=str,
        default="tell me my next work events AND health events in calendar style for the next 3 weeks.",
        help="The query to ask about the notes."
    )
    args = parser.parse_args()
    get_joplin_summary(args.query)
