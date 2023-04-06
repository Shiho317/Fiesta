import React from "react";

type MainProp = {
  children: React.ReactNode;
  className?: string;
};

const Main = (props: MainProp) => {
  return (
    <main
      className={`to-80 h-screen w-full bg-gradient-to-tr from-fiesta-100 from-10% via-white via-60% to-fiesta-100 ${
        props.className ?? ""
      }`}
    >
      {props.children}
    </main>
  );
};

export default Main;
