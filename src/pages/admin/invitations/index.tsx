import { useSession } from "next-auth/react";
import React from "react";

import AuthenticatedLayout from "~/components/common/AuthenticatedLayout";
import Empty from "~/components/common/base/Empty";
import Main from "~/components/common/base/Main";
import InvitationBoard from "~/components/invitations/InvitationBoard";
import { api } from "~/utils/api";

import { type NextPageWithLayout } from "~/types";

const InvitationPage: NextPageWithLayout = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <h1>Loading</h1>;
  }

  const { data: eventData } = api.event.getAllEventsByUserId.useQuery({
    userId: session?.user.id as string,
  });

  return (
    <Main className="p-8">
      <h1 className="text-3xl font-semibold text-gray-300">Invitations</h1>
      {eventData && eventData.length > 0 ? (
        <div className="grid grid-cols-4 items-stretch gap-4">
          {eventData.map((event) => (
            <InvitationBoard event={event} key={event.id} />
          ))}
        </div>
      ) : (
        <Empty content="No Invitations Exist." />
      )}
    </Main>
  );
};

InvitationPage.getLayout = (page) => {
  return (
    <AuthenticatedLayout>
      <>{page}</>
    </AuthenticatedLayout>
  );
};

export default InvitationPage;
