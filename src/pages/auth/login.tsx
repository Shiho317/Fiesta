import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Link from "next/link";

import Button from "~/components/common/base/Button";
import Header from "~/components/common/base/Header";
import DefaultLayout from "~/components/common/DefaultLayout";
import classicBalloons from "../../../public/images/classic-balloons.jpg";
import Main from "~/components/common/base/Main";

import { type NextPageWithLayout } from "~/types";

type LoginProp = {
  email: string;
};

const Login: NextPageWithLayout = () => {
  const { data: session } = useSession();
  const router = useRouter();
  if (session) {
    void router.push(`/admin`);
  }

  const { register, handleSubmit } = useForm<LoginProp>();

  const onSubmit = async (data: LoginProp) => {
    const result = await signIn("email", {
      redirect: false,
      email: data.email,
      callbackUrl: "/admin",
    });
    if (result?.error) {
      toast.error("[🔴 ERROR] Failed to login with your email.");
    } else {
      void router.push("/auth/verify-request");
    }
  };

  return (
    <Main className="flex items-center justify-center">
      <Header />
      <div className="z-10 flex h-1/2 w-1/3 flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-200/50 p-4 shadow-md shadow-gray-300/30 backdrop-blur-md backdrop-filter">
        <form
          className="grid w-2/3 grid-rows-3 gap-8"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h2 className="text-center text-2xl">HELLO</h2>
          <input
            id="email"
            className="text-center text-black outline-none"
            type="email"
            placeholder="YOUR EMAIL"
            {...register("email")}
            required
          />
          <Button content="LOGIN" type="submit" />
        </form>
        <Link
          href={"/auth/signup"}
          className="mt-4 text-sm text-fiesta-400 hover:text-fiesta-300"
        >
          You don&apos;t have account?
        </Link>
      </div>
      <div className="absolute right-0 h-full w-full mix-blend-multiply">
        <Image src={classicBalloons} alt="fiesta-image" fill={true} priority />
      </div>
    </Main>
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
