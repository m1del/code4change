import { createContext } from "react";

interface Options {
  level: string;
  goal: string;
  num_days: number;
  notes: string;
  setOptions: (options: Options) => void;
}

const OptionsContext = createContext<Options>({
  level: "easy",
  goal: "weightlifting",
  num_days: 3,
  notes: "",
  setOptions: () => {},
});

export default OptionsContext;
