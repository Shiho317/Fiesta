import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";

import Button from "~/components/common/base/Button";
import Header from "~/components/common/base/Header";
import DefaultLayout from "~/components/common/DefaultLayout";
import classicBalloons from "../../../public/images/classic-balloons.jpg";

import { type NextPageWithLayout } from "~/types";

const Login: NextPageWithLayout = () => {
  const { data: session } = useSession();
  const router = useRouter();
  if (session) {
    void router.push(`/admin/${session.user.id}`);
  }

  return (
    <main className="flex h-screen w-full items-center justify-center">
      <Header />
      <div className="z-10 flex h-1/2 w-1/3 items-center justify-center rounded-sm border border-gray-200 bg-gray-200/50 p-4 shadow-md shadow-gray-300/30 backdrop-blur-md backdrop-filter">
        <div className="grid w-2/3 grid-rows-3 gap-8">
          <h2 className="text-center text-2xl tracking-wider">WELCOME</h2>
          <input
            className="text-center text-black outline-none"
            type="text"
            placeholder="YOUR EMAIL"
          />
          <Button content="LOGIN" onClick={() => signIn} />
        </div>
      </div>
      <div className="absolute right-0 h-full w-full mix-blend-multiply">
        <Image src={classicBalloons} alt="fiesta-image" fill={true} priority />
      </div>
    </main>
  );
};

Login.getLayout = (page) => {
  return (
    <DefaultLayout>
      <>{page}</>
    </DefaultLayout>
  );
};

export default Login;
