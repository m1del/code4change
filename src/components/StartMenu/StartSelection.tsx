import { createSearchParams, useNavigate } from "react-router-dom";
import { useContext } from "react";
import OptionContext from "../../context/OptionContext";

interface Props {
  icon: JSX.Element;
  text: string;
}

export default function StartSelection({ icon, text }: Props) {
  const navigate = useNavigate();
  const { goal, num_days, notes, setOptions } = useContext(OptionContext);

  const HandleNavigate = () => {
    setOptions({
      level: text.toLowerCase(),
      goal: goal,
      num_days: num_days,
      notes: notes,
      setOptions,
    });
    navigate({
      pathname: "/options",
    });
  };

  return (
    <div
      className="flex flex-col items-center justify-center gap-5 bg-primary border-2 py-4 rounded-xl w-40 hover:bg-primary-lighter transition-colors duration-300 hover:cursor-pointer hover:border-white border-gray-400"
      onClick={HandleNavigate}
    >
      {icon}
      <p>{text}</p>
    </div>
  );
}
