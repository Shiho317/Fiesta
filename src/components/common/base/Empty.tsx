import React from "react";

type EmptyProp = {
  title: string;
  content: string;
};

const Empty = (props: EmptyProp) => {
  return (
    <div className="">
      <h1 className="text-3xl font-semibold text-gray-300">{props.title}</h1>
      <div className="flex h-full w-full items-center justify-center">
        <h2 className="pb-10 text-xl">{props.content}</h2>
      </div>
    </div>
  );
};

export default Empty;
