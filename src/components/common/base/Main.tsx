import React from "react";

import MediaQuery from "./MediaQuery";

type MainProp = {
  children: React.ReactNode;
  className?: string;
};

const Main = (props: MainProp) => {
  const { isTabletOrMobile } = MediaQuery();
  return (
    <main
      className={`to-80 h-full w-full bg-gradient-to-tr from-fiesta-100 from-10% via-white via-60% to-fiesta-100 laptop:h-screen ${
        isTabletOrMobile ? "py-20" : ""
      } ${props.className ?? ""}`}
    >
      {props.children}
    </main>
  );
};

export default Main;
