import React from "react";
import StartSelection from "./StartSelection";
import { IconContext } from "react-icons";
import { FaPersonRunning } from "react-icons/fa6";
import { FaSkull } from "react-icons/fa";
import { CiDumbbell } from "react-icons/ci";
import { FadeIn } from "../Animation/FadeIn";
export default function Start() {
  return (
    <FadeIn direction="none">
      <div className="flex flex-col items-center h-screen justify-center pb-36">
        <h1 className="text-4xl mb-20 font-semibold">Gym Genius</h1>
        <p className="text-xl mb-16">Choose your level to start:</p>
        <div className="flex md:flex-row flex-col gap-8 md:gap-16 text-xl">
          <IconContext.Provider
            value={{ className: "text-[2rem] md:text-[2.5rem]" }}
          >
            <FadeIn direction="bottom" delay={0.25}>
              <StartSelection icon={<FaPersonRunning />} text="Beginner" />
            </FadeIn>
            <FadeIn direction="bottom" delay={0.45}>
              <StartSelection icon={<CiDumbbell />} text="Intermediate" />
            </FadeIn>
            <FadeIn direction="bottom" delay={0.65}>
              <StartSelection icon={<FaSkull />} text="Advanced" />
            </FadeIn>
          </IconContext.Provider>
        </div>
      </div>
    </FadeIn>
  );
}
