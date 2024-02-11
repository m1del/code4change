export default function WorkoutDay({
  numDay,
  day,
  name,
  warm_up,
  exercises,
  cool_down,
  notes,
  getWorkout,
}) {
  return (
    <div>
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-semibold mb-1">
          Day {numDay}: {day}
        </h1>
        <h2 className="pb-8">{name}</h2>
      </div>
      <h2 className="font-semibold text-xl mb-1">Warmup:</h2>
      <p className="text-lg mb-8">{warm_up}</p>
      <h2 className="font-semibold text-xl mb-1">Main Exercises:</h2>
      <div className="flex flex-col gap-1 mb-8">
        {exercises.map((exercise, index) => (
          <p
            className="hover:bg-primary-lighter hover:cursor-pointer text-lg"
            key={index}
            onClick={() => getWorkout(exercise.exercise)}
          >
            {exercise.exercise}: {exercise.description}
          </p>
        ))}
      </div>
      <h2 className="font-semibold text-xl mb-1">Cooldown:</h2>
      <p className="text-lg mb-8">{cool_down}</p>
      <h2 className="font-semibold text-xl mb-1">Notes:</h2>
      <div className="flex flex-col gap-1">
        {notes != null && notes.map((noteObj, index) => (
          <p className="text-lg" key={index}>
            {noteObj.note}{" "}
          </p>
        ))}
      </div>
    </div>
  );
}
