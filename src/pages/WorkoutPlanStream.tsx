import React, { useEffect, useState } from "react";

interface Exercise {
  name: string;
  description: string;
}

interface WorkoutPlan {
  day: string;
  name: string;
  "warm-up": string;
  exercises: Exercise[];
  "cool-down": string;
  notes: string[];
}

interface YoutubeVideo {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
  };
}

const WorkoutPlanComponent: React.FC = () => {
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [workoutVideos, setWorkoutVideos] = useState<YoutubeVideo[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const samplePayload = {
      level: "beginner",
      goal: "weightlifting",
      num_days: 1,
      notes: "limited ankle mobility",
    };
    const setupAndFetchData = async () => {
      const setupResponse = await fetch(
        "http://localhost:5000/setupWorkoutPlan",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(samplePayload),
        },
      );

      if (setupResponse.ok) {
        const { session_id } = await setupResponse.json();
        const eventSource = new EventSource(
          `http://localhost:5000/generateWorkoutPlan?session_id=${session_id}`,
        );
        let currentPlan: WorkoutPlan = {
          day: "",
          name: "",
          "warm-up": "",
          exercises: [],
          "cool-down": "",
          notes: [],
        };
        let buffer = "";

        eventSource.onmessage = (event) => {
          const { message } = JSON.parse(event.data);

          if (message === null) {
            //gpt ends streams with a "null"
            eventSource.close();
            setWorkoutPlans((prevPlans) => [...prevPlans, currentPlan]);
            return;
          }

          buffer += message;

          if (buffer.includes("\n")) {
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            lines.forEach((line) => {
              const colonIndex = line.indexOf(":");
              const key = line
                .substring(0, colonIndex)
                .trim()
                .replace(/"/g, "");
              const value = line
                .substring(colonIndex + 1)
                .trim()
                .replace(/"/g, "");

              if (key === "exercise") {
                const [name, description] = value
                  .split(":")
                  .map((part) => part.trim());
                currentPlan.exercises.push({ name, description });
              } else if (key) {
                // all other keys
                if (key === "note") {
                  currentPlan.notes.push(value);
                } else {
                  // reset for new day
                  if (key === "day" && currentPlan.day) {
                    setWorkoutPlans((prevPlans) => [...prevPlans, currentPlan]);
                    currentPlan = {
                      day: "",
                      name: "",
                      "warm-up": "",
                      exercises: [],
                      "cool-down": "",
                      notes: [],
                    };
                  }
                  currentPlan[key] = value;
                }
              }
            });
          }
        };

        return () => eventSource.close();
      } else {
        console.error("Failed to setup workout plan");
      }
    };

    setupAndFetchData();
  }, []);

  const fetchYoutubeVideos = async (exerciseName: string) => {
    console.log(exerciseName);
    const response = await fetch(
      `http://localhost:5000/searchYoutubeVideos?query=${encodeURIComponent(exerciseName)}`,
    );
    if (response.ok) {
      const videos: YoutubeVideo[] = await response.json();
      setWorkoutVideos(videos);
      console.log(videos);
    } else {
      console.error("Failed to fetch YouTube videos");
      setWorkoutVideos([]);
    }
  };

  return (
    <div>
      <div>
        <h1>Workout Plans</h1>
        {workoutPlans.map((plan, index) => (
          <div key={index}>
            <h2>
              {plan.day}: {plan.name}
            </h2>
            <p>Warm-up: {plan["warm-up"]}</p>
            <h3>Exercises</h3>
            <ul>
              {plan.exercises.map((exercise, idx) => (
                <li
                  key={idx}
                  onClick={() => fetchYoutubeVideos(exercise.name)}
                  style={{ cursor: "pointer" }}
                >
                  <strong>{exercise.name}:</strong> {exercise.description}
                </li>
              ))}
            </ul>
            <p>
              <strong>Cool-down:</strong> {plan["cool-down"]}
            </p>
            <ul>
              {plan.notes.map((note, idx) => (
                <li key={idx}>{note}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div>
        {workoutVideos.map((video, index) => (
          <div key={index}>
            <h4>{video.snippet.title}</h4>
            <iframe
              width="560"
              height="315"
              src={`https://www.youtube.com/embed/${video.id.videoId}`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkoutPlanComponent;
