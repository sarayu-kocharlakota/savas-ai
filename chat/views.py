from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
import json
import requests
# Initialize OpenAI client with your API key

def get_llm_response(user_message: str) -> str:
    """
    Gets a response from your LLM server using synchronous requests.
    """
    print(user_message)
    LLM_SERVER_ENDPOINT = "http://34.55.216.50:8080/wa/get-llm-response"
    try:
        response = requests.post(LLM_SERVER_ENDPOINT, json={"prompt": user_message, 'system_prompt':'', 'chat_history':''}, timeout=None)
        response.raise_for_status()

        return response.json().get("text", "Sorry, I had a problem processing that.")

    except requests.RequestException as e:
        print(f"Error connecting to LLM server: {e}")
        return "Sorry, I'm having trouble connecting to my brain right now."

    except Exception as e:
        print(f"An unexpected error occurred with the LLM server: {e}")
        return "An unexpected error occurred."

def index(request):
    return render(request, 'chat/index.html')

@csrf_exempt  # Note: remove this in production and handle CSRF properly
def chat_api(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user_message = data.get("message", "")

            if not user_message:
                return JsonResponse({"error": "No message provided"}, status=400)

            response = get_llm_response(user_message)

            # Extract the bot's response
            bot_response = response['text'] if isinstance(response, dict) else response
            return JsonResponse({"response": bot_response})

        except Exception as e:
            return JsonResponse({"response": f"Sorry, something went wrong. ({str(e)})"})

    return JsonResponse({"error": "Invalid request method"}, status=405)

def chat_page(request):
    return render(request, 'chat/index.html')
