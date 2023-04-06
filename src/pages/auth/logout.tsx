import React from "react";

import Main from "~/components/common/base/Main";
import DefaultLayout from "~/components/common/DefaultLayout";

import { type NextPageWithLayout } from "~/types";

const Logout: NextPageWithLayout = () => {
  return (
    <Main className="flex items-center justify-center">
      <div className="relative z-10 flex h-1/2 w-1/2 items-center rounded-lg border border-fiesta-200 bg-white/20 p-4 shadow-lg shadow-gray-300/30 backdrop-blur-md backdrop-filter">
        {/* TODO: LOGO HERE */}
        <h2 className="m-auto text-xl font-semibold">
          You successfully logged out.
          <br /> See you soon! 👋
        </h2>
      </div>
    </Main>
  );
};

Logout.getLayout = (page) => {
  return (
    <DefaultLayout>
      <>{page}</>
    </DefaultLayout>
  );
};

export default Logout;
