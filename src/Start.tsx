import React from "react";
import Option from "./components/StartMenu/Option";
import { FaPersonRunning } from "react-icons/fa6";
import { FaSkull } from "react-icons/fa";
import { CiDumbbell } from "react-icons/ci";
export default function Start() {
  const iconSize = "2.5rem";
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl mb-20 font-semibold">Gym Genius</h1>
      <p className="text-lg mb-16">Choose your level to start:</p>
      <div className="flex gap-16 text-xl">
        <Option icon={<FaPersonRunning size={iconSize} />} text="Beginner" />
        <Option icon={<FaSkull size={iconSize} />} text="Intermediate" />
        <Option icon={<CiDumbbell size={iconSize} />} text="Advanced" />
      </div>
    </div>
  );
}
