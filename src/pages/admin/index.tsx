import { useSession } from "next-auth/react";
import Error from "next/error";
import React from "react";

import AuthenticatedLayout from "~/components/common/AuthenticatedLayout";
import Main from "~/components/common/base/Main";

import { type NextPageWithLayout } from "~/types";

const AdminDashBoard: NextPageWithLayout = () => {
  const { status } = useSession();

  //404 error page if session is not authenticated
  if (status === "unauthenticated") {
    return <Error statusCode={404} title="Failed to authenticate" />;
  }

  return (
    <Main className="flex min-h-screen items-center justify-center">
      <h1 className="text-2xl font-bold leading-loose text-fiesta-400/50 tablet:text-4xl laptop:text-7xl">
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
