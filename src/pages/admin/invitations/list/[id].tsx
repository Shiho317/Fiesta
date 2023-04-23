import { useRouter } from "next/router";
import React from "react";
import { PlusCircleIcon } from "@heroicons/react/24/solid";

import AuthenticatedLayout from "~/components/common/AuthenticatedLayout";
import Empty from "~/components/common/base/Empty";
import Main from "~/components/common/base/Main";
import InvitationTable from "~/components/invitations/InvitationTable";
import { api } from "~/utils/api";

import { type NextPageWithLayout } from "~/types";
import Link from "next/link";

const InvitationList: NextPageWithLayout = () => {
  const router = useRouter();
  const { id: eventId } = router.query;

  const { data: eventData } = api.event.getById.useQuery({
    id: eventId as string,
  });

  const { data: invitations } = api.invitation.getAllInvitationByEvent.useQuery(
    {
      eventId: eventId as string,
    }
  );

  return (
    <Main className="p-8">
      <h1 className="text-3xl font-semibold text-gray-300">Invitation List</h1>
      {invitations && invitations.length > 0 ? (
        <InvitationTable invitations={invitations} />
      ) : (
        <Empty content="No one is invited." />
      )}
      {eventData && !eventData?.canceled && (
        <Link
          href={`/admin/invitations/new/${eventId as string}`}
          className="has-tooltip absolute bottom-10 right-10 bg-transparent text-fiesta-300 drop-shadow-lg hover:text-gray-300"
        >
          <PlusCircleIcon className="h-16 w-16" />
        </Link>
      )}
    </Main>
  );
};

InvitationList.getLayout = (page) => {
  return (
    <AuthenticatedLayout>
      <>{page}</>
    </AuthenticatedLayout>
  );
};

export default InvitationList;
