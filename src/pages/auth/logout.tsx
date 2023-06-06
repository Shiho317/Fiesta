import React from "react";
import Image from "next/image";

import Main from "~/components/common/base/Main";
import DefaultLayout from "~/components/common/DefaultLayout";
import Logo from "../../../public/images/fiesta-logo.png";

import { type NextPageWithLayout } from "~/types";

const Logout: NextPageWithLayout = () => {
  return (
    <Main className="flex min-h-screen items-center justify-center">
      <div className="relative z-10 flex h-1/2 w-4/5 flex-col items-center justify-center gap-2 rounded-lg border border-fiesta-200 bg-white/20 p-4 shadow-lg shadow-gray-300/30 backdrop-blur-md backdrop-filter tablet:w-1/2">
        <div className="flex h-20 w-full items-center justify-center overflow-hidden">
          <Image src={Logo} alt="fiesta-logo" width={250} priority />
        </div>
        <h2 className="text-lg font-semibold laptop:text-xl">
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
