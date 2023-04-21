import React from "react";

type EmptyProp = {
  content: string;
};

const Empty = (props: EmptyProp) => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <h2 className="pb-10 text-xl">{props.content}</h2>
    </div>
  );
};

export default Empty;
