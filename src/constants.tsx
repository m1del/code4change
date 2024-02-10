export default function getPrompt(level: string | null, goal: string, numDays: string) {
	const prompt =
`I want you to act as a personal trainer. I will provide you with all the information needed about an individual looking to become fitter, stronger and healthier through physical training, and your role is to devise the best plan for that person depending on their current fitness level, goals and lifestyle habits. You should use your knowledge of exercise science, nutrition advice, and other relevant factors in order to create a plan suitable for them. Warm-up and Cool-down are required in every workout Include important notes relating to the workout. Use the relevant information in the text below and give the output in JSON format.

Desired Format:
“Day”: “$(Day of Week)”
“Name”: “$(Workout Name)”
“Warm-up”: “$(Warm up information)”
“$(For exercises in workout):”
- “$(Workout name)”: “$(Workout description)”
“Cool-Down”: “$(Cool down information)”
(If Notes):
“Notes”: $(Important Notes)

Example input text: “For an advanced individual in fitness, design an exercise program for weightlifting over 2 days a week.”
Example formatted output:
[
	{
    	"day": "Monday",
    	"name": "Full Body Strength Training",
    	"warm-up": "5-10 minutes of light cardio (e.g., brisk walking or cycling)",
    	"exercises": [
        	{
            	"exercise": "Barbell Squats",
            	"description": "3 sets of 8-10 reps"
        	},
        	{
            	"exercise": "Dumbbell Bench Press",
            	"description": "3 sets of 8-10 reps"
        	},
        	{
            	"exercise": "Deadlifts",
            	"description": "3 sets of 8-10 reps"
        	},
        	{
            	"exercise": "Lat Pulldowns",
            	"description": "3 sets of 8-10 reps"
        	},
        	{
            	"exercise": "Overhead Dumbbell Shoulder Press",
            	"description": "3 sets of 8-10 reps"
        	},
        	{
            	"exercise": "Plank",
            	"description": "3 sets, hold for 30-60 seconds"
        	}
    	],
    	"cool-down": "5-10 minutes of stretching",
	“notes = [
	{
	“note”: “Barbell squats require good mobility. Make sure to pay extra attention to your hips and ankles during the warmup!”
	},
	],
	},
	{
    	"day": "Wednesday",
    	"name": "Cardio and Core Workout",
    	"warm-up": "5-10 minutes of light cardio (e.g., jumping jacks or brisk walking)",
    	"exercises": [
        	{
            	"exercise": "Jump Rope",
            	"description": "4 sets of 1 minute, rest 30 seconds between sets"
        	},
        	{
            	"exercise": "Russian Twists",
            	"description": "3 sets of 15-20 reps (each side)"
        	},
        	{
            	"exercise": "Bicycle Crunches",
            	"description": "3 sets of 15-20 reps (each side)"
        	},
        	{
            	"exercise": "Mountain Climbers",
            	"description": "3 sets of 20-30 seconds"
        	},
        	{
            	"exercise": "Plank with Leg Lifts",
            	"description": "3 sets, hold for 30-60 seconds"
        	}
    	],
    	"cool-down": "5-10 minutes of stretching"
	},
	“notes = [
	{
	“note”: “It is important to start each workout with a warm-up to increase blood flow and prepare the body for exercise.”
“note”: “Strength training exercises help build lean muscle mass, which can increase metabolism and aid in weight loss.”
	},
	],
]

Other example Notes:
- Cardio interval training is effective for burning calories and boosting cardiovascular fitness.
- Rest days are equally important for recovery, so make sure to include rest days in between workout days.
- Proper nutrition and hydration are key components of any weight loss program. Encourage the individual to have a balanced diet consisting of lean proteins, whole grains, fruits, and vegetables, and to drink plenty of water.

Text: “For a ${level} individual fitness, design an exercise program for ${goal} over ${numDays} days a week.”

} 
`
return prompt
}
