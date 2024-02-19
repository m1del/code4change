import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Start from "./components/StartMenu/Start";
import Options from "./components/OptionMenu/Options";
import Workout from "./components/Workout/Workout";
<<<<<<< HEAD
import OptionsContext from "./context/OptionContext";
import { useState } from "react";

interface Options {
  level: string;
  goal: string;
  num_days: number;
  notes: string;
}
=======
import WorkoutPlanStream from "./pages/WorkoutPlanStream";
>>>>>>> main

export default function App() {
  const [options, setOptions] = useState<Options>({
    level: "easy",
    goal: "weightlifting",
    num_days: 3,
    notes: "",
  });

  return (
<<<<<<< HEAD
    <OptionsContext.Provider
      value={{
        level: options.level,
        goal: options.goal,
        num_days: options.num_days,
        notes: options.notes,
        setOptions: setOptions,
      }}
    >
      <Router>
        <div className="text-secondary flex items-center justify-center bg-primary">
          <Routes>
            <Route path="/" element={<Start />} />
            <Route path="/options" element={<Options />} />
            <Route path="/workout" element={<Workout />} />
          </Routes>
        </div>
      </Router>
    </OptionsContext.Provider>
=======
    <Router>
      <div className="text-secondary flex items-center justify-center pb-36 bg-primary">
        <Routes>
          <Route path="/" element={<Start />} />
          <Route path="/options" element={<Options />} />
          <Route path="/workout" element={<Workout />} />
          <Route path="/test" element={<WorkoutPlanStream />} />
        </Routes>
      </div>
    </Router>
>>>>>>> main
  );
}
