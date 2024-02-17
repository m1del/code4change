import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Start from "./components/StartMenu/Start";
import Options from "./components/OptionMenu/Options";
import Workout from "./components/Workout/Workout";

export default function App() {
  return (
    <Router>
      <div className="text-secondary flex items-center justify-center bg-primary">
        <Routes>
          <Route path="/" element={<Start />} />
          <Route path="/options" element={<Options />} />
          <Route path="/workout" element={<Workout />} />
        </Routes>
      </div>
    </Router>
  );
}
