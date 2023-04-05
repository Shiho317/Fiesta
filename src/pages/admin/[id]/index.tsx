import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

import AuthenticatedLayout from "~/components/common/AuthenticatedLayout";

import { type NextPageWithLayout } from "~/types";

const AdminSome: NextPageWithLayout = () => {
  const router = useRouter();
  const { data: session } = useSession();

  if (!session || typeof window === "undefined") {
    router.isFallback === true;
  }

  return <>{session?.user.name}</>;
};

AdminSome.getLayout = (page) => {
  return (
    <AuthenticatedLayout>
      <>{page}</>
    </AuthenticatedLayout>
  );
};

export default AdminSome;
