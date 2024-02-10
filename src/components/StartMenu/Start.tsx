import React from "react";
import Option from "./Option";
import { FaPersonRunning } from "react-icons/fa6";
import { FaSkull } from "react-icons/fa";
import { CiDumbbell } from "react-icons/ci";
import { FadeIn } from "../Animation/FadeIn";
export default function Start() {
  const iconSize = "2.5rem";
  return (
    <FadeIn direction="none">
      <div className="flex flex-col items-center h-screen justify-center pb-36">
        <h1 className="text-4xl mb-20 font-semibold">Gym Genius</h1>
        <p className="text-xl mb-16">Choose your level to start:</p>
        <div className="flex gap-16 text-xl">
          <FadeIn direction="bottom" delay={0.25}>
            <Option
              icon={<FaPersonRunning size={iconSize} />}
              text="Beginner"
            />
          </FadeIn>
          <FadeIn direction="bottom" delay={0.45}>
            <Option icon={<FaSkull size={iconSize} />} text="Intermediate" />
          </FadeIn>
          <FadeIn direction="bottom" delay={0.65}>
            <Option icon={<CiDumbbell size={iconSize} />} text="Advanced" />
          </FadeIn>
        </div>
      </div>
    </FadeIn>
  );
}
