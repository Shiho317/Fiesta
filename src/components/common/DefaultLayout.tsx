import Head from "next/head";
import React from "react";

type LayoutProp = {
  children: React.ReactNode;
};

const DefaultLayout = (props: LayoutProp) => {
  return (
    <>
      <Head>
        <title>Fiesta</title>
        <meta
          name="description"
          content="Fiesta is a platform for organize your party. We help you to host any kind of party from planning to hosting more easier. Your special day will be more special."
        />
      </Head>
      {props.children}
    </>
  );
};

export default DefaultLayout;
