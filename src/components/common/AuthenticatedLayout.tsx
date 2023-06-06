import { useSession } from "next-auth/react";
import Head from "next/head";
import React from "react";

import DefaultLayout from "./DefaultLayout";
import SideBar from "./SideBar";
import MediaQuery from "./base/MediaQuery";
import FooterNav from "./mobile/FooterNav";
import Header from "./mobile/Header";

type LayoutProp = {
  children: React.ReactNode;
};

const AuthenticatedLayout = (props: LayoutProp) => {
  const { status } = useSession();
  const { isTabletOrMobile } = MediaQuery();

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
      <div className="flex">
        {isTabletOrMobile && <Header />}
        {isTabletOrMobile ? <FooterNav /> : <SideBar />}
        {props.children}
      </div>
    </>
  );
};

export default AuthenticatedLayout;
