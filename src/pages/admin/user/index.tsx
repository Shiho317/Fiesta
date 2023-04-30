import { useSession } from "next-auth/react";
import Image from "next/image";
import { UserIcon, PencilIcon } from "@heroicons/react/24/outline";
import { LegacyRef, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

import AuthenticatedLayout from "~/components/common/AuthenticatedLayout";
import Main from "~/components/common/base/Main";
import Input from "~/components/common/base/Input";
import { api } from "~/utils/api";

import { type NextPageWithLayout } from "~/types";

type UserProfileInput = {
  name: string;
  email: string;
  password: string;
};

const UserPage: NextPageWithLayout = () => {
  const { data: session } = useSession();

  const { register, handleSubmit, setValue } = useForm<UserProfileInput>();

  const { data: userData, error } = api.user.getByEmail.useQuery({
    email: session?.user.email as string,
  });

  const [profileType, setProfileType] = useState<"view" | "edit">("view");

  const { mutate: updateUserInfo } = api.user.updateUser.useMutation({
    onSuccess: () => {
      toast.success("Updated your information.");
      setProfileType("view");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const uploadProfilePic = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const onSubmit = (data: UserProfileInput) => {
    const { name, email, password } = data;
    updateUserInfo({
      name,
      email,
      password,
      id: session?.user.id as string,
    });
  };

  useEffect(() => {
    if (!error && userData) {
      setValue("name", userData.user.name ?? "");
      setValue("email", userData.user.email);
      setValue("password", userData.password as string);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  return (
    <Main className="p-8">
      <div>
        <div className="grid grid-cols-5 gap-4">
          <div className="relative z-10 col-span-2 mt-4 flex  items-center rounded-lg border border-gray-200 bg-fiesta-100/30 p-4 shadow-md shadow-gray-300/30 backdrop-blur-md backdrop-filter">
            <div className="m-auto flex flex-col items-center gap-2">
              <div
                className="flex h-40 w-40 cursor-pointer items-center justify-center rounded-full bg-gray-300 hover:border-2 hover:border-fiesta-300"
                onClick={uploadProfilePic}
              >
                {userData && userData.user.image ? (
                  <Image src={""} alt="Profile Image" className="w-full" />
                ) : (
                  <UserIcon className="h-24 w-24 text-gray-200" />
                )}
              </div>
              <input type="file" ref={inputRef} className="hidden" />
              <button
                type="button"
                className="cursor-pointer text-xs text-gray-400 hover:text-fiesta-300"
                onClick={uploadProfilePic}
              >
                Change your picture
              </button>
            </div>
          </div>
          <div className="relative z-10 col-span-3 mt-4 rounded-lg border border-gray-200 bg-fiesta-100/30 p-4 shadow-md shadow-gray-300/30 backdrop-blur-md backdrop-filter">
            <form className="mt-5" onSubmit={handleSubmit(onSubmit)}>
              <Input
                type="text"
                label="Name"
                name="name"
                register={register}
                inputStyle={profileType == "view" ? "bg-transparent" : ""}
                readOnly={profileType === "view" ? true : false}
              />
              <Input
                type="email"
                label="Email"
                name="email"
                register={register}
                inputStyle={profileType == "view" ? "bg-transparent" : ""}
                readOnly={profileType === "view" ? true : false}
              />
              <Input
                type={profileType === "view" ? "password" : "text"}
                label="Password"
                name="password"
                register={register}
                inputStyle={profileType == "view" ? "bg-transparent" : ""}
                readOnly={profileType === "view" ? true : false}
              />
            </form>
            {profileType === "view" ? (
              <button
                type="button"
                className="absolute right-5 top-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-md hover:bg-gray-200"
                onClick={() => setProfileType("edit")}
              >
                <PencilIcon className="h-5 w-5 text-fiesta-400" />
              </button>
            ) : (
              <button
                type="submit"
                className="absolute right-5 top-2 flex cursor-pointer items-center justify-center rounded-md px-4 py-2 hover:bg-gray-200"
              >
                <p className="text-fiesta-400">Save</p>
              </button>
            )}
          </div>
        </div>
        <div className="relative z-10 mt-4 rounded-lg border border-gray-200 bg-fiesta-100/30 p-4 shadow-md shadow-gray-300/30 backdrop-blur-md backdrop-filter"></div>
      </div>
    </Main>
  );
};

UserPage.getLayout = (page) => {
  return (
    <AuthenticatedLayout>
      <>{page}</>
    </AuthenticatedLayout>
  );
};

export default UserPage;
