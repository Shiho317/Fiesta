import { useSession } from "next-auth/react";
import Error from "next/error";
import { useRouter } from "next/router";
import React from "react";

import AuthenticatedLayout from "~/components/common/AuthenticatedLayout";
import Main from "~/components/common/base/Main";

import { type NextPageWithLayout } from "~/types";

const AdminDashBoard: NextPageWithLayout = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      //TODO: Loading bars
      <></>
    );
  }

  //404 error page if session is not authenticated
  if (status === "unauthenticated") {
    return <Error statusCode={404} title="Failed to authenticate" />;
  }

  return (
    <Main className="to-80 bg-gradient-to-tr from-fiesta-100 from-10% via-white via-60% to-fiesta-100">
      <h1 className="text-7xl font-bold leading-loose text-fiesta-400/50">
        WELCOME BACK!
      </h1>
      {/* TODO: Or maybe logo */}
    </Main>
  );
};

AdminDashBoard.getLayout = (page) => {
  return (
    <AuthenticatedLayout>
      <>{page}</>
    </AuthenticatedLayout>
  );
};

export default AdminDashBoard;
