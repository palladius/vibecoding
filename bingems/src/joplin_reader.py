import os
import sqlite3
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

def get_joplin_summary():
    """
    Summarizes Joplin notes from the 'salute' and 'Viaggi' folders.
    """
    # Connect to the Joplin database
    db_path = '/Users/ricc/git/vibecoding/vibecheck/etc/joplin.sqlite'
    conn = sqlite3.connect(db_path)
    c = conn.cursor()

    # Get the folder IDs
    c.execute("SELECT id, title FROM folders WHERE title IN ('salute', 'Viaggi')")
    folders = c.fetchall()
    folder_ids = [folder[0] for folder in folders]

    # Get the note titles
    c.execute(f"SELECT title FROM notes WHERE parent_id IN ({','.join(['?']*len(folder_ids))})", folder_ids)
    notes = c.fetchall()
    note_titles = [note[0] for note in notes]

    # Create the prompt
    prompt = f"""
    You are a helpful assistant. Your task is to summarize the following Joplin notes.
    The notes are from the 'salute' and 'Viaggi' folders.

    Here are the note titles:
    {note_titles}

    Please provide a concise summary of these notes.
    """

    # Generate content using the model
    response = model.generate_content(prompt)

    # Print the response
    print(response.text)

if __name__ == "__main__":
    get_joplin_summary()
