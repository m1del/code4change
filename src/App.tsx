import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Start from "./components/StartMenu/Start";
import Options from "./components/OptionMenu/Options";

export default function App() {
  return (
    <Router>
      <div className="text-secondary h-screen flex items-center justify-center pb-36 bg-primary">
        <Routes>
          <Route path="/" element={<Start />} />
          <Route path="/Options" element={<Options />} />
        </Routes>
      </div>
    </Router>
  );
}
