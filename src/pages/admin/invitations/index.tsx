import { useSession } from "next-auth/react";
import React from "react";

import AuthenticatedLayout from "~/components/common/AuthenticatedLayout";
import Empty from "~/components/common/base/Empty";
import Main from "~/components/common/base/Main";
import InvitationBoard from "~/components/invitations/InvitationBoard";
import { api } from "~/utils/api";
import LoadingQuery from "~/components/common/base/LoadingQuery";

import { type NextPageWithLayout } from "~/types";

const InvitationPage: NextPageWithLayout = () => {
  const { data: session } = useSession();

  const { data: eventData, isLoading } =
    api.event.getAllEventsByUserId.useQuery({
      userId: session?.user.id as string,
    });

  return (
    <LoadingQuery isLoading={isLoading}>
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
    </LoadingQuery>
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
