import React from "react";

type MainProp = {
  children: React.ReactNode;
  className?: string;
};

const Main = (props: MainProp) => {
  return (
    <main
      className={`flex h-screen w-full items-center justify-center ${
        props.className ?? ""
      }`}
    >
      {props.children}
    </main>
  );
};

export default Main;
