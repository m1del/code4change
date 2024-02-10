import React from "react";
import WorkoutDay from "./WorkoutDay";
const workouts = [
  {
    Day: "Monday",
    Name: "Full Body Strength Training",
    "Warm-up": "5-10 minutes of light cardio (e.g., brisk walking or cycling)",
    Exercises: [
      {
        Exercise: "Barbell Squats",
        Description: "3 sets of 8-10 reps",
      },
      {
        Exercise: "Dumbbell Bench Press",
        Description: "3 sets of 8-10 reps",
      },
      {
        Exercise: "Deadlifts",
        Description: "3 sets of 8-10 reps",
      },
      {
        Exercise: "Lat Pulldowns",
        Description: "3 sets of 8-10 reps",
      },
      {
        Exercise: "Overhead Dumbbell Shoulder Press",
        Description: "3 sets of 8-10 reps",
      },
      {
        Exercise: "Plank",
        Description: "3 sets, hold for 30-60 seconds",
      },
    ],
    "Cool-Down": "5-10 minutes of stretching",
  },
  {
    Day: "Wednesday",
    Name: "Cardio and Core Workout",
    "Warm-up":
      "5-10 minutes of light cardio (e.g., jumping jacks or brisk walking)",
    Exercises: [
      {
        Exercise: "Jump Rope",
        Description: "4 sets of 1 minute, rest 30 seconds between sets",
      },
      {
        Exercise: "Russian Twists",
        Description: "3 sets of 15-20 reps (each side)",
      },
      {
        Exercise: "Bicycle Crunches",
        Description: "3 sets of 15-20 reps (each side)",
      },
      {
        Exercise: "Mountain Climbers",
        Description: "3 sets of 20-30 seconds",
      },
      {
        Exercise: "Plank with Leg Lifts",
        Description: "3 sets, hold for 30-60 seconds",
      },
    ],
    "Cool-Down": "5-10 minutes of stretching",
  },
  {
    Day: "Friday",
    Name: "Upper Body Strength Training",
    "Warm-up":
      "5-10 minutes of light cardio (e.g., rowing machine or arm circles)",
    Exercises: [
      {
        Exercise: "Barbell Rows",
        Description: "3 sets of 8-10 reps",
      },
      {
        Exercise: "Dumbbell Shoulder Press",
        Description: "3 sets of 8-10 reps",
      },
      {
        Exercise: "Dumbbell Bicep Curls",
        Description: "3 sets of 8-10 reps",
      },
      {
        Exercise: "Tricep Dips",
        Description: "3 sets of 8-10 reps",
      },
      {
        Exercise: "Push-ups",
        Description: "3 sets of 8-12 reps",
      },
    ],
    "Cool-Down": "5-10 minutes of stretching",
  },
  {
    Day: "Saturday",
    Name: "Lower Body Strength Training",
    "Warm-up": "5-10 minutes of light cardio (e.g., jogging or cycling)",
    Exercises: [
      {
        Exercise: "Barbell Lunges",
        Description: "3 sets of 8-10 reps (each leg)",
      },
    ],
  },
];

export default function Workout() {
  return (
    <div className="w-[70%] pt-16">
      <div className="flex flex-col w-full items-center">
        <h1 className="text-3xl font-bold pb-6">Workout Plan</h1>
        <div className="flex flex-col items-center text-lg mb-4">
          <h2>Difficulty: Beginner</h2>
          <h2>Days a week: 4</h2>
          <h2>Focus: Weightlifting</h2>
        </div>
      </div>
      <div className="flex w-full bg-slate-950 px-16 rounded-xl">
        <div className="flex flex-col gap-16 mt-16">
          {workouts.map((workout, index) => (
            <WorkoutDay
              numDay={index + 1}
              day={workout.Day}
              name={workout.Name}
              warm_up={workout["Warm-up"]}
              exercises={workout.Exercises}
            />
          ))}
        </div>
        <div className="">potato</div>
      </div>
    </div>
  );
}
