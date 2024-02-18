import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Start from "./components/StartMenu/Start";
import Options from "./components/OptionMenu/Options";
import Workout from "./components/Workout/Workout";
import OptionsContext from "./context/OptionContext";
import { useState } from "react";

interface Options {
  level: string;
  goal: string;
  num_days: number;
  notes: string;
}

export default function App() {
  const [options, setOptions] = useState<Options>({
    level: "easy",
    goal: "weightlifting",
    num_days: 3,
    notes: "",
  });

  return (
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
  );
}
