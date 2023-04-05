import React from "react";

import Main from "~/components/common/base/Main";
import DefaultLayout from "~/components/common/DefaultLayout";

import { type NextPageWithLayout } from "~/types";

const VerifyRequest: NextPageWithLayout = () => {
  return (
    <Main className="to-80 bg-gradient-to-tr from-fiesta-100 from-10% via-white via-60% to-fiesta-100">
      <div className="relative z-10 flex h-1/2 w-1/2 items-center rounded-lg border border-fiesta-200 bg-white/20 p-4 shadow-lg shadow-gray-300/30 backdrop-blur-md backdrop-filter">
        {/* TODO: LOGO HERE */}
        <h2 className="m-auto text-xl font-semibold">
          We sent you email for verifying your account and to login.
          <br /> Please check your email. 💐
        </h2>
      </div>
    </Main>
  );
};

VerifyRequest.getLayout = (page) => {
  return (
    <DefaultLayout>
      <>{page}</>
    </DefaultLayout>
  );
};

export default VerifyRequest;
