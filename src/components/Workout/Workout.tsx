import React, { useState } from "react";
import WorkoutDay from "./WorkoutDay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

const workouts = [
  {
    day: "Monday",
    name: "Full Body Strength Training",
    "warm-up": "5-10 minutes of light cardio (e.g., brisk walking or cycling)",
    exercises: [
      {
        exercise: "Bodyweight Squats",
        description: "3 sets of 10-12 reps",
      },
      {
        exercise: "Push-ups (on knees if needed)",
        description: "3 sets of 8-10 reps",
      },
      {
        exercise: "Dumbbell Rows",
        description: "3 sets of 8-10 reps (each arm)",
      },
      {
        exercise: "Dumbbell Shoulder Press",
        description: "3 sets of 8-10 reps",
      },
      {
        exercise: "Plank",
        description: "3 sets, hold for 20-30 seconds",
      },
    ],
    "cool-down": "5-10 minutes of stretching",
    notes: [
      "It's essential for beginners to start with bodyweight exercises to build a foundation of strength and proper form.",
      "Focus on maintaining good form throughout each exercise to prevent injury and maximize results.",
    ],
  },
  {
    day: "Wednesday",
    name: "Lower Body Strength Training",
    "warm-up": "5-10 minutes of light cardio (e.g., brisk walking or cycling)",
    exercises: [
      {
        exercise: "Goblet Squats",
        description: "3 sets of 10-12 reps",
      },
      {
        exercise: "Dumbbell Lunges",
        description: "3 sets of 10-12 reps (each leg)",
      },
      {
        exercise: "Romanian Deadlifts",
        description: "3 sets of 8-10 reps",
      },
      {
        exercise: "Calf Raises",
        description: "3 sets of 12-15 reps",
      },
      {
        exercise: "Side Planks",
        description: "3 sets, hold for 20-30 seconds (each side)",
      },
    ],
    "cool-down": "5-10 minutes of stretching",
    notes: [
      "Focus on mastering proper squat and lunge form before adding weight to prevent knee and back injuries.",
      "Increase weights gradually as strength improves, but always prioritize safety and form over heavy lifting.",
    ],
  },
  {
    day: "Friday",
    name: "Upper Body Strength Training",
    "warm-up": "5-10 minutes of light cardio (e.g., brisk walking or cycling)",
    exercises: [
      {
        exercise: "Dumbbell Bench Press",
        description: "3 sets of 8-10 reps",
      },
      {
        exercise: "Dumbbell Rows",
        description: "3 sets of 8-10 reps (each arm)",
      },
      {
        exercise: "Dumbbell Shoulder Press",
        description: "3 sets of 8-10 reps",
      },
      {
        exercise: "Bicep Curls",
        description: "3 sets of 10-12 reps",
      },
      {
        exercise: "Tricep Dips",
        description: "3 sets of 8-10 reps",
      },
    ],
    "cool-down": "5-10 minutes of stretching",
    notes: [
      "Start with lighter weights to focus on form and gradually increase weight as you gain strength.",
      "Ensure proper rest between sets to allow muscles to recover and prevent fatigue-induced injuries.",
    ],
  },
  {
    day: "Saturday",
    name: "Total Body Strength Training",
    "warm-up": "5-10 minutes of light cardio (e.g., brisk walking or cycling)",
    exercises: [
      {
        exercise: "Deadlifts",
        description: "3 sets of 8-10 reps",
      },
      {
        exercise: "Pull-ups (assisted if needed)",
        description: "3 sets of 6-8 reps",
      },
      {
        exercise: "Push-ups",
        description: "3 sets of 8-10 reps",
      },
      {
        exercise: "Dumbbell Lunges",
        description: "3 sets of 10-12 reps (each leg)",
      },
      {
        exercise: "Plank",
        description: "3 sets, hold for 20-30 seconds",
      },
    ],
    "cool-down": "5-10 minutes of stretching",
    notes: [
      "Include a variety of exercises targeting different muscle groups for a well-rounded strength workout.",
      "Don't forget to listen to your body and adjust weights or reps as needed to avoid overexertion.",
    ],
  },
];

export default function Workout() {
  const [workoutVideo, setWorkoutVideo] = useState("potato");
  const getWorkout = (exercise) => {
    const pattern = /\([^)]*\)/g;

    // Use replace() method to remove text inside parentheses
    const result = exercise.replace(pattern, "");
    console.log(result.trim());
    setWorkoutVideo(result.trim());
  };

  return (
    <div className="w-[70%] pt-16 h-screen">
      <div className="flex flex-col w-full items-center">
        <h1 className="text-4xl font-bold pb-6">Workout Plan</h1>
        <div className="flex flex-col items-center text-xl font-semibold mb-4">
          <h2>Difficulty: Beginner</h2>
          <h2>Days a week: 4</h2>
          <h2>Focus: Weightlifting</h2>
        </div>
      </div>
      <div className="flex w-full bg-slate-950 rounded-xl h-[90%]">
        <div className="flex w-[50%] flex-col gap-16 mt-16 overflow-scroll pb-20 px-14">
          <div className="w-full">
            <Carousel>
              <CarouselContent>
                {workouts.map((workout, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <Card>
                        <CardContent className="flex aspect-square items-center justify-center p-6">
                          <WorkoutDay
                            numDay={index + 1}
                            day={workout.day}
                            name={workout.name}
                            warm_up={workout["warm-up"]}
                            exercises={workout.exercises}
                            cool_down={workout["cool-down"]}
                            notes={workout.notes}
                            getWorkout={getWorkout}
                          />
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>
        <div className="w-[50%] flex items-center justify-center">
          {workoutVideo}
        </div>
      </div>
    </div>
  );
}
