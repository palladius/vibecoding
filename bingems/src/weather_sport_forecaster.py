import os
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

model = genai.GenerativeModel(
    'gemini-1.5-flash',
    tools=['google_search_retrieval'],
)


def get_weather_and_sports_forecast():
    """
    Provides a weather and sport forecast for Zurich.
    """
    prompt = """
    You are a helpful assistant for an ironman athlete in Zurich.
    Your task is to provide a concise forecast for today, {today_date}.
    Please check the following and provide a recommendation for training:
    1.  **Weather in Zurich for today:** Is it sunny, rainy, or something else?
    2.  **Lake Zurich water temperature:** Is it 20°C or warmer?
    3.  **Hallenbad City opening hours:** Is it open today?

    Based on this information, recommend whether to **swim**, **run**, or **cycle**.
    Remember:
    *   I can run in the rain.
    *   I cannot cycle in the rain.
    *   I can only swim in the lake if the water is 20°C or warmer.
    """

    # Format the prompt with the current date
    today_date = datetime.now().strftime("%Y-%m-%d")
    formatted_prompt = prompt.format(today_date=today_date)

    # Generate content using the model
    response = model.generate_content(formatted_prompt)

    # Print the response
    print(response.text)

if __name__ == "__main__":
    get_weather_and_sports_forecast()
