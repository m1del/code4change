import React from "react";

export default function WorkoutDay({ numDay, day, name, warm_up, exercises }) {
  return (
    <div>
      <h1 className="text-xl font-semibold">
        Day {numDay} : {day}
      </h1>
      <h2>{name}</h2>
      <p>{warm_up}</p>
      <div className="flex flex-col">
        {exercises.map((exercise, index) => (
          <p key={index}>
            {exercise.Exercise} {exercise.Description}
          </p>
        ))}
      </div>
    </div>
  );
}
