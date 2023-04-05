import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import Button from "~/components/common/base/Button";
import Header from "~/components/common/base/Header";
import Main from "~/components/common/base/Main";
import DefaultLayout from "~/components/common/DefaultLayout";
import { api } from "~/utils/api";
import dinosaurParty from "../../../public/images/dinosaur-party.jpg";

import { type NextPageWithLayout } from "~/types";

type SignUpProp = {
  email: string;
  name: string;
  password: string;
};

const SignUp: NextPageWithLayout = () => {
  const router = useRouter();
  const { register, handleSubmit } = useForm<SignUpProp>();

  const { mutate: createUser } = api.user.createUser.useMutation({
    async onSuccess(data) {
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
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: SignUpProp) => {
    const { name, email, password } = data;
    createUser({
      name,
      email,
      password,
    });
  };

  return (
    <Main>
      <Header />
      <div className="z-10 flex h-2/3 w-1/3 flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-200/50 p-4 shadow-md shadow-gray-300/30 backdrop-blur-md backdrop-filter">
        <form
          className="grid w-2/3 grid-rows-5 gap-8"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h2 className="text-center text-2xl">WELCOME</h2>
          <input
            id="name"
            className="text-center text-black outline-none"
            type="text"
            placeholder="YOUR NAME"
            {...register("name")}
            required
          />
          <input
            id="email"
            className="text-center text-black outline-none"
            type="email"
            placeholder="YOUR EMAIL"
            {...register("email")}
            required
          />
          <input
            id="password"
            className="text-center text-black outline-none"
            type="text"
            placeholder="YOUR PASSWORD"
            {...register("password")}
            required
          />
          <Button content="LOGIN" type="submit" />
        </form>
        <Link
          href={"/auth/login"}
          className="mt-4 text-sm text-fiesta-400 hover:text-fiesta-300"
        >
          You have account?
        </Link>
      </div>
      <div className="absolute right-0 h-full w-full mix-blend-multiply">
        <Image src={dinosaurParty} alt="fiesta-image" fill={true} priority />
      </div>
    </Main>
  );
};

SignUp.getLayout = (page) => {
  return (
    <DefaultLayout>
      <>{page}</>
    </DefaultLayout>
  );
};

export default SignUp;
