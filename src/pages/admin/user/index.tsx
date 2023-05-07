import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import AuthenticatedLayout from "~/components/common/AuthenticatedLayout";
import Main from "~/components/common/base/Main";
import { api } from "~/utils/api";
import UserProfilePicture from "~/components/user/UserProfilePicture";
import UserProfileForm from "~/components/user/UserProfileForm";
import UserChart from "~/components/user/UserChart";

import { type NextPageWithLayout } from "~/types";

type UserProfileInput = {
  name: string;
  email: string;
  password: string;
};

const UserPage: NextPageWithLayout = () => {
  const { data: session } = useSession();

  const { register, handleSubmit, setValue } = useForm<UserProfileInput>();
  const [profilePicture, setProfilePicture] = useState<string | undefined>(
    undefined
  );

  const { data: userData, error } = api.user.getByEmail.useQuery({
    email: session?.user.email as string,
  });

  useEffect(() => {
    if (!error && userData) {
      setValue("name", userData.user.name ?? "");
      setValue("email", userData.user.email);
      setValue("password", userData.password);
      setProfilePicture(userData.user.image?.url);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  return (
    <Main className="p-8">
      <div className="grid grid-rows-5">
        <div className="row-span-2 grid grid-cols-5 gap-4">
          <UserProfilePicture url={profilePicture} />
          <UserProfileForm register={register} handleSubmit={handleSubmit} />
        </div>
        <UserChart />
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
