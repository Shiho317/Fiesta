import { useSession } from "next-auth/react";
import Head from "next/head";
import React from "react";
import DefaultLayout from "./DefaultLayout";

type LayoutProp = {
  children: React.ReactNode;
};

const AuthenticatedLayout = (props: LayoutProp) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: session, status } = useSession();

  if (status === "loading") {
    //TODO: add loading component
    return <>{props.children}</>;
  }

  if (status === "unauthenticated") {
    return <DefaultLayout>{props.children}</DefaultLayout>;
  }

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

export default AuthenticatedLayout;
