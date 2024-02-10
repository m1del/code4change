import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import "./App.css";

const Home = () => (
  <div>
    <h2>Home Page</h2>
    <Button>Home Button</Button>
  </div>
);

const About = () => (
  <div>
    <h2>About Page</h2>
    <Button>About Button</Button>
  </div>
);

export default function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}
