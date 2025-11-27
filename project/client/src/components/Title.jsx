import React from "react";

const Title = ({ Title, Decription, align }) => {
  return (
    <div
      className={`w-full flex-col flex items-${align} gap-[2vh] lg:mt-0 mt-[2vh]  `}
    >
      <h1 className="font-playfair lg:text-6xl text-4xl font-bold text-neutral-600">
        {Title}
      </h1>
      <p
        className={`text-neutral-500 lg:text-lg text-sm max-w-[80vw]  lg:max-w-[50vw] text-${align}`}
      >
        {Decription}
      </p>
    </div>
  );
};

export default Title;
