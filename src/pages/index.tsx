import Image from "next/image";
import { useRouter } from "next/router";

import DefaultLayout from "~/components/common/DefaultLayout";
import champagneWithConfetti from "../../public/images/champagne-confetti.jpg";
import Button from "~/components/common/base/Button";
import Header from "~/components/common/base/Header";

import { type NextPageWithLayout } from "~/types";

//if user is not logged in, stay here. login button -> login
//if user is already logged in, login button -> jump to user home page.

const Home: NextPageWithLayout = () => {
  const router = useRouter();
  const clickHandler = () => {
    void router.push("/auth/login");
  };
  return (
    <>
      <main className="h-screen w-screen bg-white">
        <Header />
        <div>
          <div className="absolute left-1/2 top-1/2 z-10 flex h-1/2 w-3/4 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg border border-gray-200 bg-gray-100/25 shadow-md shadow-gray-300/30 backdrop-blur-md backdrop-filter tablet:w-2/3 laptop:left-1/4 laptop:w-1/3">
            <div className="w-full p-8">
              <h1 className="text-4xl font-semibold">BE SPECIAL</h1>
              <p className="mt-6 text-base text-gray-500">
                We help you to organize any kind of party from planning to
                hosting more easier. <br /> Your special day will be more
                special.
              </p>
              <Button
                content="LOGIN"
                className="mt-12 px-8"
                onClick={() => clickHandler()}
              />
            </div>
          </div>
          <div className="absolute right-0 h-full w-full mix-blend-multiply laptop:h-full laptop:w-3/4">
            <Image
              src={champagneWithConfetti}
              alt="fiesta-image"
              fill={true}
              priority
            />
          </div>
        </div>
      </main>
    </>
  );
};

Home.getLayout = (page) => {
  return (
    <DefaultLayout>
      <>{page}</>
    </DefaultLayout>
  );
};

export default Home;
