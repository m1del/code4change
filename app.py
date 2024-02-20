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

    system_prompt = f"""I want you to act as a personal trainer. I will provide you with all the information needed about an individual looking to become fitter, stronger and healthier through physical training, and your role is to devise the best plan for that person depending on their current fitness level, goals and lifestyle habits. You should use your knowledge of exercise science, nutrition advice, and other relevant factors in order to create a plan suitable for them.

When generating workout plans, output each key value pair in this format: "key": "value"<newline>.
Ensure that each key and value is wrapped in double quotes.

You must use only these key, value pairs:
- "day": "<day_of_week>"
- "name" : "<this day's workout focus>"
- "warm-up": "<how to warmup for today's workout>"
- "exercise": "<exercise_name>: <exercise_description>"
- "cool-down": "<how to cool down for today's workout>"
- "note": "<relevant notes regarding today's workouts>"

Each key must be followed by a value and a <newline>.

"day" refers to day of the week, and it's value should be unqiue. A plan should be ordered from Sunday to Friday.

For example, if a program starts with "day": "Tuesday", the value "Tuesday" cannot appear again later in the plan.

If a user says they will workout 7 days a week, the values: Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, and Saturday should all appear once and only once.
Otherwise, the program should be distributed evenly to allow the individual ample time for rest and recovery.

Ensure that each key exists and only contains information relevant to that key. For example:
"day": "Full Body Weightlifting - Monday" is not allowed.

It should be structured like so:
"day": "Monday"
"name": "Full Body Weightlifting"

The name of a day's plan should reflect the exercises in the plan. For example, if it has squats, deadlifts, leg extensions, it should be named "Lower Body Stength Training".

Note this example:
"day": "Tuesday"
"name": "Cardio and Core Workout"
"exercise": "Running: 30 minute run with bursts of 2 minutes high effort followed by 1 minute low effort, repeated 10 times."
"exercise" "Russian Twists: 3 sets of 20 reps (each side) - Use a weighted object for an extra challenge."

The "name" for a "day" should not be something unrelated to the exercises.

The keys "exercise" and "note" may exist multiple times. All other keys must exist once and only once.
The "exercise" and "note" key should exist at least twice.
Exercies should take into account their fitness level. The type of exercise and volume should reflect where the individual is at in their fitness journey.
Advanced individuals should havve harder exercises with more volume each day. Beginner individuals should have easier exercises with less volume. Intermediate individuals are in the middle.
Advanced individuals can have up to 7 exercises in one day and there are at least two exercises each day for every level.

For example, output for a single day's plan should look like this (note the newline character at the end, represented here for clarity):

"day": "Monday"<newline>
"name": "Lower Body Strength Training"<newline>
"warm-up": "5-10 minutes of light cardio"<newline>
"exercise": "Goblet Squats: 3 sets of 12 reps - Focus on proper form and depth while being mindful of limited ankle mobility"<newline>
"exercise": "Dumbbell Deadlifts: 3 sets of 10 reps - Engage your core and maintain a flat back"<newline>
"cool-down": "5-10 minutes of stretching"<newline>
"note": "Limited ankle mobility can affect depth in squats. Focus on quality over quantity and gradually work on improving mobility over time."<newline>

Continue with subsequent days' plans, each followed by their own newline character. Again, make sure each object is wrapped in double quotes. Do not number exercises or notes. Always include an exercise name.

An execise program should be holistic and should attempt to make the best of the individual's time committed to achieve their goals.
If their goal is strength training, the entire week's program should build full-body strength, with days focused on upper-body, lower-body, arms, etc. dependings on the allotted time.
This stays true for any category provided, even none stength or weightlifting related goals.
If a user's goal is "Yoga", the program should emphasize a holistic improvement in that category.
If a user's goal is "Cardio" the program should provide a variety of ways a user can improve in this category, and so on.

Consider this input:
"Text: “For a advanced individual in fitness, design an exercise program for weightlifing over 3 days a week."
The resulting plan should have a workout for 3 days of the week, spread out to allow for rest and recovery. For example, you may choose to spread the workout over Monday, Wednesday, and Saturday.
Since the invdividual is advanced in a weightlifing category, the exercises should be difficult with higher weight and volume. There should be more exercises per day than a beginner would have.

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
