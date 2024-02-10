from flask import Flask, request, jsonify
from dotenv import load_dotenv
import os
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

load_dotenv()

OPENAI_SECRET = os.getenv("OPENAI_SECRET")
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    messages = data.get('messages')

    if not messages:
        return jsonify({"error": "No messages provided"}), 400

    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {OPENAI_SECRET}'
    }

    payload = {
        'model': 'gpt-3.5-turbo',
        'messages': messages,
        'temperature': 0.7
    }

    response = requests.post('https://api.openai.com/v1/chat/completions', json=payload, headers=headers)

    if response.status_code == 200:
        openai_response = response.json()
        return jsonify(openai_response), 200
    else:
        error_info = {
            "error": "Failed to communicate with OpenAI API",
            "status_code": response.status_code,
            "response_body": response.text
        }
        return jsonify(error_info), response.status_code

@app.route('/searchYoutubeVideos', methods=['GET'])
def search_youtube_videos():
    query = request.args.get('query')
    if not query:
        return jsonify({"error": "No query provided"}), 400

    YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search"
    params = {
        'part': 'snippet',
        'maxResults': 5,
        'q': query,
        'type': 'video',
        'key': YOUTUBE_API_KEY
    }

    response = requests.get(YOUTUBE_SEARCH_URL, params=params)

    if response.status_code == 200:
        youtube_response = response.json()
        return jsonify(youtube_response['items']), 200
    else:
        error_info = {
            "error": "Failed to communicate with YouTube API",
            "status_code": response.status_code,
            "response_body": response.text
        }
        return jsonify(error_info), response.status_code

if __name__ == '__main__':
    app.run(debug=True)
