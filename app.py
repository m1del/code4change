from flask import Flask, Response, request, jsonify, stream_with_context
from flask_cors import CORS 
from dotenv import load_dotenv
import os
import json 
import requests
import uuid
from openai import OpenAI

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

load_dotenv()

OPENAI_SECRET = os.getenv("OPENAI_SECRET")
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")

client = OpenAI(
    api_key=OPENAI_SECRET
)

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
        'maxResults': 3,
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




sessions = {}

@app.route('/generateWorkoutPlan', methods=['GET'])
def generate_workout_plan():
    session_id = request.args.get('session_id')
    if not session_id or session_id not in sessions:
        return jsonify({"error": "Invalid session ID"}), 400

    data = sessions[session_id]

    # Extract data from session
    level = data.get('level', 'average')
    goal = data.get('goal', 'general fitness')
    num_days = data.get('num_days', 3)
    notes = data.get('notes', 'The individual is of average fitness levels.')

    system_prompt = f"""I want you to act as a personal trainer. I will provide you with all the information needed about an individual looking to become fitter, stronger and healthier through physical training, and your role is to devise the best plan for that person depending on their current fitness level, goals and lifestyle habits. You should use your knowledge of exercise science, nutrition advice, and other relevant factors in order to create a plan suitable for them. Warm-up and Cool-down are required in every workout. Include important notes relating to the workout. Use the relevant information in the text below and give the output in JSON format.

Desired Format:
“day”: “${{day of week}}”
“name”: “${{workout name}}”
“warm-up”: “${{warm up information}}”
“${{for exercises in workout}}:”
- “${{workout name}}”: “${{workout description}}”
“cool-down”: “${{cool down information}}”
(if notes):
“notes”: [${{notes}}]

Example input text: “For an advanced individual in fitness, design an exercise program for weightlifting over 1 days a week.”
Example formatted output: [
    {{
            "day": "Monday",
            "name": "Full Body Strength Training",
            "warm-up": "5-10 minutes of light cardio (e.g., brisk walking or cycling)",
            "exercises": [
                {{
                    "exercise": "Barbell Squats",
                    "description": "3 sets of 8-10 reps"
                }},
                {{
                    "exercise": "Dumbbell Bench Press",
                    "description": "3 sets of 8-10 reps"
                }},
                {{
                    "exercise": "Deadlifts",
                    "description": "3 sets of 8-10 reps"
                }},
                {{
                    "exercise": "Lat Pulldowns",
                    "description": "3 sets of 8-10 reps"
                }},
                {{
                    "exercise": "Overhead Dumbbell Shoulder Press",
                    "description": "3 sets of 8-10 reps"
                }},
                {{
                    "exercise": "Plank",
                    "description": "3 sets, hold for 30-60 seconds"
                }}
            ],
            "cool-down": "5-10 minutes of stretching",
            "notes": [
                {{
                "note": "Barbell Squats require a lot of hip and ankle mobility. Make sure you are stretching properly!"
                }}
            ]
    }}
]
Other example Notes:
- Cardio interval training is effective for burning calories and boosting cardiovascular fitness.
- Rest days are equally important for recovery, so make sure to include rest days in between workout days.
- Proper nutrition and hydration are key components of any weight loss program. Encourage the individual to have a balanced diet consisting of lean proteins, whole grains, fruits, and vegetables, and to drink plenty of water."""

    user_prompt = f"Text: “For a {level} individual in fitness, design an exercise program for {goal} over {num_days} days a week. Keep these considerations in mind:\n {notes}”"

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt}
    ]
    
    def generate_stream(client, messages):
            try:
                stream = client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=messages,
                    stream=True
                )

                for chunk in stream:
                    chunk_message = chunk.choices[0].delta.content
                    yield f"data: {json.dumps({'message': chunk_message})}\n\n"

            except Exception as e:
                yield f"data: {json.dumps({'error': 'Failed to communicate with OpenAI API', 'details': str(e)})}\n\n"
    return Response(stream_with_context(generate_stream(client, messages)), mimetype='text/event-stream')

@app.route('/setupWorkoutPlan', methods=['POST'])
def setup_workout_plan():
    data = request.get_json()
    session_id = str(uuid.uuid4())
    sessions[session_id] = data
    return jsonify({"session_id": session_id})

if __name__ == '__main__':
    app.run(debug=True)
