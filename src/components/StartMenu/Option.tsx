import React from "react";
import { createSearchParams, useNavigate } from "react-router-dom";

interface Props {
  icon: JSX.Element;
  text: string;
}

export default function Option({ icon, text }: Props) {
  const navigate = useNavigate();

  const HandleNavigate = () => {
    navigate({
      pathname: "/options",
      search: createSearchParams({
        difficulty: text.toLowerCase(),
      }).toString(),
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
