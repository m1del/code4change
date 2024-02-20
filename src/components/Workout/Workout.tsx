import { useEffect, useState } from "react";
import WorkoutDay from "./WorkoutDay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { FadeIn } from "../Animation/FadeIn";
import { useContext } from "react";
import OptionsContext from "../../context/OptionContext";

export default function Workout() {
  const [workoutVideos, setWorkoutVideos] = useState([]);
  const { level, goal, num_days, notes } = useContext(OptionsContext);
  const [searchQuery, setSearchQuery] = useState("");
  const newLevel = level[0].toUpperCase() + level.slice(1);
  const newGoal = goal[0].toUpperCase() + goal.slice(1);
  const navigate = useNavigate();

  async function getResponse(
    difficulty: string,
    type_workout: string,
    num_days: string
  ) {
    const response = await sendWorkoutPlanRequest(
      difficulty,
      type_workout,
      num_days
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

  useEffect(() => {
    const eventSource = new EventSource(
      `http://127.0.0.1:5000/generateWorkoutPlan?level=${difficulty}&goal=${type_workout}&numDay=${num_days}`
    );
    let currentWorkoutChunk = "";

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // Ensure that 'message' exists and is not null before proceeding
      if (data && data.message) {
        currentWorkoutChunk += data.message;

        // Check for a potential end of a workout object message
        // Assuming '}' signifies the end of a JSON object in your stream
        if (data.message.trim().endsWith("}")) {
          try {
            // Parse the accumulated string as JSON and add to workouts
            const workoutObject = JSON.parse(currentWorkoutChunk);
            setWorkouts((prevWorkouts) => [...prevWorkouts, workoutObject]);
            currentWorkoutChunk = ""; // Reset for the next workout object
          } catch (error) {
            console.error("Error parsing workout data:", error);
          }
        }
      }
    };

    eventSource.onerror = (error) => {
      console.error("EventSource failed:", error);
      eventSource.close();
      setLoaded(true); // Mark as loaded even if there was an error
    };

    return () => {
      eventSource.close();
    };
  }, [difficulty, type_workout, num_days]);

  const getWorkout = (exercise) => {
    const pattern = /\([^)]*\)/g;
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
        `http://localhost:5000/searchYoutubeVideos?query=${result}`
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
    <div className="w-full max-w-screen-xl pt-16">
      <FadeIn direction="none" width="100%">
        <div className="w-full h-full">
          <div className="flex flex-col w-full items-center">
            <h1 className="text-4xl font-bold pb-6">Workout Plan</h1>
            <div className="flex flex-col items-center text-xl font-semibold mb-4">
              <h2>Difficulty: {newLevel}</h2>
              <h2>Days a Week: {num_days}</h2>
              <h2>Focus: {newGoal}</h2>
            </div>
          </div>
          <Button onClick={() => onBack()} variant="secondary">
            Return to Start
          </Button>
          <div className="lg:flex-row flex-col flex w-full bg-slate-950 rounded-xl h-[90%] mb-24">
            <div className="flex w-full lg:w-[50%] flex-col gap-16 mt-16 overflow-scroll lg:pb-20 px-10 lg:px-14">
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
            <div className="lg:w-[50%] flex items-center justify-center">
              <FadeIn width="100%" direction="bottom" delay={0.75}>
                <div className="flex flex-col w-full items-center">
                  {workoutVideos.length > 0 && (
                    <iframe
                      className=" w-[400px] md:w-[450px] xl:w-[500px] aspect-video"
                      src={`https://www.youtube.com/embed/${workoutVideos[0].id.videoId}`}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  )}

                  {workoutVideos.length > 0 && (
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
                  )}
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
