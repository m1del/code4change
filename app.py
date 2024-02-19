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
    level = data.get('level', 'average')
    goal = data.get('goal', 'general fitness')
    num_days = data.get('num_days', 3)
    notes = data.get('notes', 'The individual is of average fitness levels.')

    system_prompt = f"""I want you to act as a personal trainer. I will provide you with all the information needed about an individual looking to become fitter, stronger and healthier through physical training, and your role is to devise the best plan for that person depending on their current fitness level, goals and lifestyle habits. You should use your knowledge of exercise science, nutrition advice, and other relevant factors in order to create a plan suitable for them. Warm-up and Cool-down are required in every workout. Include important notes relating to the workout. Use the relevant information in the text below.

When generating workout plans, output each key value pair in this format: "key": "value" <newline>.
Ensure that each key and value is wrapped in double quotes.

You may use these keys:
- "day"
- "name"
- "warm-up"
- "exercise"
- "cool-down"
- "note"

Ensure that each key exists and only contains information relevant to that key. For example:
"day": "Full Body Weightlifting - Monday" is not allowed.

It should be structured like so:
"day": "Monday"
"name": "Full Body Weightlifting"

The keys "exercise" and "note" may exist multiple times. ALl other keys must exist once and only once.
The "exercise" and "note" key should exist at least twice. Advanced individuals may even have 5 exercises.

For example, output for a single day's plan should look like this (note the newline character at the end, represented here for clarity):

"day": "Monday"
"name": "Lower Body Strength Training"
"warm-up": "5-10 minutes of light cardio"
"exercise": "Goblet Squats: 3 sets of 12 reps - Focus on proper form and depth while being mindful of limited ankle mobility"
"exercise": "Dumbbell Deadlifts: 3 sets of 10 reps - Engage your core and maintain a flat back"
"cool-down": "5-10 minutes of stretching"
"note": "Limited ankle mobility can affect depth in squats. Focus on quality over quantity and gradually work on improving mobility over time."

Continue with subsequent days' plans, each followed by their own newline character. Again, make sure each object is wrapped in double quotes. Do not number exercises or notes. Always include an exercise name.

Include at least two notes for each day. Be considerate to the individual. Here are examples of notes:
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
