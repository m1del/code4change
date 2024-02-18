import React, { useEffect, useState } from "react";

interface Exercise {
  exercise: string;
  description: string;
}

interface WorkoutPlanMessage {
  day?: string;
  name?: string;
  "warm-up"?: string;
  exercises?: Exercise[];
  "cool-down"?: string;
  notes?: string[];
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
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlanMessage[]>([]);
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
        let buffer = "";
        eventSource.onmessage = (event) => {
          const chunk = event.data;
          console.log("chunk", chunk);
          buffer += chunk;
          console.log("buffer", buffer);
          // check if buffer contains delimiter
          let delimiterIndex;
          while ((delimiterIndex = buffer.indexOf("\n")) !== -1) {
            // extract the complete json object from the buffer
            const completeJson = buffer.substring(0, delimiterIndex);
            buffer = buffer.substring(delimiterIndex + 1);

            try {
              const jsonData: WorkoutPlanMessage = JSON.parse(completeJson);
              setWorkoutPlans((prevPlans) => [...prevPlans, jsonData]);
            } catch (e) {
              console.error("Failed to parse JSON data:", e);
            }
          }
        };

        return () => {
          eventSource.close();
        };
      } else {
        console.error("Failed to setup workout plan");
      }
    };

    setupAndFetchData();
  }, []);

  const getWorkoutVideos = async (exercise: string) => {
    const pattern = /\([^)]*\)/g;
    const result = exercise.replace(pattern, "").trim();
    setSearchQuery(result); // storing query for "See More" button

    try {
      const response = await fetch(
        `http://localhost:5000/searchYoutubeVideos?query=${encodeURIComponent(result)}`,
      );
      const data = await response.json();
      setWorkoutVideos(data);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  return (
    <div>
      <h2>Workout Plan Messages</h2>
      {workoutPlans.length > 0 &&
        workoutPlans.map((plan, index) => (
          <div key={index}>
            <h3>
              {plan.day}: {plan.name}
            </h3>
            <ul>
              {plan.exercises?.map((exercise, idx) => (
                <li
                  key={idx}
                  onClick={() => getWorkoutVideos(exercise.exercise)}
                  style={{ cursor: "pointer" }}
                >
                  {exercise.exercise} - {exercise.description}
                </li>
              ))}
            </ul>
          </div>
        ))}
      <div>
        {workoutVideos.length > 0 && (
          <iframe
            width="560"
            height="315"
            src={`https://www.youtube.com/embed/${workoutVideos[0].id.videoId}`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        )}

        {workoutVideos.length > 0 && (
          <button
            onClick={() =>
              window.open(
                `https://www.youtube.com/results?search_query=${searchQuery}`,
                "_blank",
              )
            }
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            See More
          </button>
        )}
      </div>
    </div>
  );
};

export default WorkoutPlanComponent;
