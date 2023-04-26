import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

import Main from "~/components/common/base/Main";
import { api } from "~/utils/api";
import LoadingQuery from "~/components/common/base/LoadingQuery";
import DefaultLayout from "~/components/common/DefaultLayout";

import { type NextPageWithLayout } from "~/types";

const AttendParty: NextPageWithLayout = () => {
  const router = useRouter();
  const { id: token } = router.query;

  const [guestName, setGuestName] = useState<string>("");

  const { mutate: attendEvent, isLoading } =
    api.invitation.responseInvitation.useMutation({
      onSuccess: (data) => {
        setGuestName(data.name);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    attendEvent({
      token: token as string,
      attend: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <LoadingQuery isLoading={isLoading} label="Checking your invitation...">
      <Main className="flex items-center justify-center">
        <div className="relative z-10 flex h-1/2 w-1/2 flex-col items-center justify-center gap-4 rounded-lg border border-fiesta-200 bg-white/20 p-4 shadow-lg shadow-gray-300/30 backdrop-blur-md backdrop-filter">
          <CheckCircleIcon className="h-40 w-40 text-fiesta-300" />
          <div>
            <h1 className="text-center text-2xl uppercase">
              Thank you, {guestName}!
            </h1>
            <p className="m-auto text-center text-base">
              We&apos;re looking forward to see you there.
            </p>
          </div>
        </div>
      </Main>
    </LoadingQuery>
  );
};

AttendParty.getLayout = (page) => {
  return (
    <DefaultLayout>
      <>{page}</>
    </DefaultLayout>
  );
};

export default AttendParty;
