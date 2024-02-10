import React from "react";

interface Props {
  icon: JSX.Element;
  text: string;
}

export default function Option({ icon, text }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-5 bg-primary border-2 py-4 rounded-xl w-40 hover:bg-primary-lighter transition-colors duration-300 hover:cursor-pointer hover:border-white border-gray-400">
      {icon}
      <p>{text}</p>
    </div>
  );
}
