import { PencilIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

import Input from "../common/base/Input";
import Button from "../common/base/Button";
import { api } from "~/utils/api";

import {
  type UseFormHandleSubmit,
  type UseFormRegister,
} from "react-hook-form";

type UserProfileInput = {
  name: string;
  email: string;
  password: string;
};

type UserProfileProp = {
  register: UseFormRegister<UserProfileInput>;
  handleSubmit: UseFormHandleSubmit<UserProfileInput>;
};

const UserProfileForm = (props: UserProfileProp) => {
  const { data: session } = useSession();
  const { register, handleSubmit } = props;

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

  const onSubmit = (data: UserProfileInput) => {
    console.log("hello");
    const { name, email, password } = data;
    updateUserInfo({
      name,
      email,
      password,
      id: session?.user.id as string,
    });
  };

  return (
    <div className="relative z-10 col-span-5 mt-4 rounded-lg border border-gray-200 bg-fiesta-100/30 p-4 shadow-md shadow-gray-300/30 backdrop-blur-md backdrop-filter tablet:col-span-3">
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
        {profileType === "view" ? (
          <button
            type="button"
            className="absolute right-5 top-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-md hover:bg-gray-200"
            onClick={() => setProfileType("edit")}
          >
            <PencilIcon className="h-5 w-5 text-fiesta-400" />
          </button>
        ) : (
          <Button
            content="Save"
            type="submit"
            className="absolute right-5 top-2 flex cursor-pointer items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm text-fiesta-400 hover:bg-gray-200"
          />
        )}
      </form>
    </div>
  );
};

export default UserProfileForm;
