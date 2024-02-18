import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Start from "./components/StartMenu/Start";
import Options from "./components/OptionMenu/Options";
import Workout from "./components/Workout/Workout";
import WorkoutPlanStream from "./pages/WorkoutPlanStream";

export default function App() {
  return (
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
  );
}
