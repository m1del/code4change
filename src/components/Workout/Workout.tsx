import { useEffect, useState } from "react";
import WorkoutDay from "./WorkoutDay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {Button} from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSearchParams, useNavigate } from "react-router-dom";
import { sendWorkoutPlanRequest } from "@/services/api";
import {FadeIn} from "../Animation/FadeIn";

// const workouts = [
// {
//   day: "Monday",
//   name: "Full Body Strength Training",
//   "warm-up": "5-10 minutes of light cardio (e.g., brisk walking or cycling)",
//   exercises: [
//     {
//       exercise: "Bodyweight Squats",
//       description: "3 sets of 10-12 reps",
//     },
//     {
//       exercise: "Push-ups (on knees if needed)",
//       description: "3 sets of 8-10 reps",
//     },
//     {
//       exercise: "Dumbbell Rows",
//       description: "3 sets of 8-10 reps (each arm)",
//     },
//     {
//       exercise: "Dumbbell Shoulder Press",
//       description: "3 sets of 8-10 reps",
//     },
//     {
//       exercise: "Plank",
//       description: "3 sets, hold for 20-30 seconds",
//     },
//   ],
//   "cool-down": "5-10 minutes of stretching",
//   notes: [
//     "It's essential for beginners to start with bodyweight exercises to build a foundation of strength and proper form.",
//     "Focus on maintaining good form throughout each exercise to prevent injury and maximize results.",
//   ],
// },
// {
//   day: "Wednesday",
//   name: "Lower Body Strength Training",
//   "warm-up": "5-10 minutes of light cardio (e.g., brisk walking or cycling)",
//   exercises: [
//     {
//       exercise: "Goblet Squats",
//       description: "3 sets of 10-12 reps",
//     },
//     {
//       exercise: "Dumbbell Lunges",
//       description: "3 sets of 10-12 reps (each leg)",
//     },
//     {
//       exercise: "Romanian Deadlifts",
//       description: "3 sets of 8-10 reps",
//     },
//     {
//       exercise: "Calf Raises",
//       description: "3 sets of 12-15 reps",
//     },
//     {
//       exercise: "Side Planks",
//       description: "3 sets, hold for 20-30 seconds (each side)",
//     },
//   ],
//   "cool-down": "5-10 minutes of stretching",
//   notes: [
//     "Focus on mastering proper squat and lunge form before adding weight to prevent knee and back injuries.",
//     "Increase weights gradually as strength improves, but always prioritize safety and form over heavy lifting.",
//   ],
// },
// {
//   day: "Friday",
//   name: "Upper Body Strength Training",
//   "warm-up": "5-10 minutes of light cardio (e.g., brisk walking or cycling)",
//   exercises: [
//     {
//       exercise: "Dumbbell Bench Press",
//       description: "3 sets of 8-10 reps",
//     },
//     {
//       exercise: "Dumbbell Rows",
//       description: "3 sets of 8-10 reps (each arm)",
//     },
//     {
//       exercise: "Dumbbell Shoulder Press",
//       description: "3 sets of 8-10 reps",
//     },
//     {
//       exercise: "Bicep Curls",
//       description: "3 sets of 10-12 reps",
//     },
//     {
//       exercise: "Tricep Dips",
//       description: "3 sets of 8-10 reps",
//     },
//   ],
//   "cool-down": "5-10 minutes of stretching",
//   notes: [
//     "Start with lighter weights to focus on form and gradually increase weight as you gain strength.",
//     "Ensure proper rest between sets to allow muscles to recover and prevent fatigue-induced injuries.",
//   ],
// },
// {
//   day: "Saturday",
//   name: "Total Body Strength Training",
//   "warm-up": "5-10 minutes of light cardio (e.g., brisk walking or cycling)",
//   exercises: [
//     {
//       exercise: "Deadlifts",
//       description: "3 sets of 8-10 reps",
//     },
//     {
//       exercise: "Pull-ups (assisted if needed)",
//       description: "3 sets of 6-8 reps",
//     },
//     {
//       exercise: "Push-ups",
//       description: "3 sets of 8-10 reps",
//     },
//     {
//       exercise: "Dumbbell Lunges",
//       description: "3 sets of 10-12 reps (each leg)",
//     },
//     {
//       exercise: "Plank",
//       description: "3 sets, hold for 20-30 seconds",
//     },
//   ],
//   "cool-down": "5-10 minutes of stretching",
//   notes: [
//     "Include a variety of exercises targeting different muscle groups for a well-rounded strength workout.",
//     "Don't forget to listen to your body and adjust weights or reps as needed to avoid overexertion.",
//   ],
// },
// ];

export default function Workout() {
  const [params] = useSearchParams();
  const [workoutVideos, setWorkoutVideos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const difficulty = params.get("difficulty") || "beginner";
  const fix = difficulty[0].toUpperCase() + difficulty.slice(1);
  const type_workout = params.get("type_workout") || "Weightlifting";
  const num_days = params.get("num_days") || "4";
  const navigate = useNavigate();

  async function getResponse(
    difficulty: string,
    type_workout: string,
    num_days: string,
  ) {
    const response = await sendWorkoutPlanRequest(
      difficulty,
      type_workout,
      num_days,
    );
    // console.log(typeof JSON.parse(response['choices'][0]['message']['content']));
    const parse = JSON.parse(response["choices"][0]["message"]["content"]);
    console.log(parse);
    setWorkouts(parse);
    setLoaded(true);
    return parse;
  }
  useEffect(() => {
    getResponse(difficulty, type_workout, num_days);
  }, []);
  const [loaded, setLoaded] = useState(false);
  const [workouts, setWorkouts] = useState([]);

  // const workouts = await getResponse(difficulty, type_workout, num_days);

  const getWorkout = (exercise) => {
    const pattern = /\([^)]*\)/g;

    // Use replace() method to remove text inside parentheses
    const result = exercise.replace(pattern, "");
    console.log(result.trim());
    getWorkoutVideos(result.trim());
  };

  const getWorkoutVideos = async (exercise) => {
    const pattern = /\([^)]*\)/g;
    const result = exercise.replace(pattern, "").trim();
    setSearchQuery(result); // store the query for the "See More" button

    try {
      const response = await fetch(
        `http://127.0.0.1:5000/searchYoutubeVideos?query=${result}`,
      );
      const data = await response.json();
      setWorkoutVideos(data);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  function onBack() {
    navigate({
      pathname: "/",
    });
  }

  return (
    <div className="w-[70%] pt-16 h-screen">
      <FadeIn direction="none" width="100%">

      <div className="flex flex-col w-full items-center">
        <h1 className="text-4xl font-bold pb-6">Workout Plan</h1>
        <div className="flex flex-col items-center text-xl font-semibold mb-4">
<<<<<<< Updated upstream
          <h2>Difficulty: {difficulty}</h2>
          <h2>Days a week: {num_days}</h2>
=======
          <h2>Difficulty: {fix}</h2>
          <h2>Days a Week: {num_days}</h2>
>>>>>>> Stashed changes
          <h2>Focus: {type_workout}</h2>
        </div>
      </div>
      <Button onClick = {() => onBack()}variant="secondary">Return to Start</Button>
      <div className="flex w-full bg-slate-950 rounded-xl h-[90%]">
        <div className="flex w-[50%] flex-col gap-16 mt-16 overflow-scroll pb-20 px-14">
          <div className="w-full">
            <Carousel>
              <CarouselContent>
                {!loaded && (
                  <CarouselItem>
                    <div className="p-1">
                      <Card>
                        <CardContent className="flex aspect-square items-center justify-center p-6">
                          <FadeIn direction="top" delay={0.55}>
                          <div className="loader"></div>
                          </FadeIn>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                )}
                {loaded &&
                  workouts.map((workout, index) => (
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
          <FadeIn width="100%" direction="bottom" delay={0.75}>
          <div className="flex flex-col w-full items-center">
            {workoutVideos.length > 0 && (
              <iframe
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${workoutVideos[0].id.videoId}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            )}

            <button
              onClick={() =>
                window.open(
                  `https://www.youtube.com/results?search_query=${searchQuery}`,
                  "_blank"
                )
              }
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
              See More
            </button>
          </div>
          </FadeIn>
        </div>
      </div>
      </FadeIn>
    </div>
  );
}
