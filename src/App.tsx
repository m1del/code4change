import { Button } from "@/components/ui/button";
import Start from "./components/StartMenu/Start";
import Options from "./components/OptionMenu/Options";

export default function App() {
  return (
    <div className="text-secondary h-screen flex items-center justify-center pb-36 bg-primary">
      <div className="container">
        {/* <Start /> */}
        <Options />
      </div>
    </div>
  );
}
