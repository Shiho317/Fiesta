import { useRouter } from "next/router";
import React, { useState } from "react";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

import AuthenticatedLayout from "~/components/common/AuthenticatedLayout";
import Empty from "~/components/common/base/Empty";
import Main from "~/components/common/base/Main";
import InvitationTable from "~/components/invitations/InvitationTable";
import { api } from "~/utils/api";
import LoadingQuery from "~/components/common/base/LoadingQuery";
import PaginationButton from "~/components/common/PaginationButton";

import { type NextPageWithLayout } from "~/types";

const InvitationList: NextPageWithLayout = () => {
  const router = useRouter();
  const { id: eventId } = router.query;

  const [skipNum, setSkipNum] = useState<number>(0);
  const takeNum = 10;

  const { data: eventData } = api.event.getById.useQuery({
    id: eventId as string,
  });

  const { data: totalLength } = api.invitation.getTotalLengthByEventId.useQuery(
    {
      eventId: eventId as string,
    }
  );

  const { data: invitations, isLoading } =
    api.invitation.getAllInvitationByEventPaginated.useQuery({
      eventId: eventId as string,
      skip: skipNum,
      take: takeNum,
    });

  return (
    <LoadingQuery isLoading={isLoading}>
      <Main className="p-8">
        <h1 className="text-3xl font-semibold text-gray-300">
          Invitation List
        </h1>
        {invitations && invitations.length > 0 ? (
          <>
            <InvitationTable invitations={invitations} />
            <div className="mt-4">
              <PaginationButton
                start={skipNum + 1}
                end={skipNum + takeNum}
                take={takeNum}
                total={totalLength as number}
                skip={setSkipNum}
              />
            </div>
          </>
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
    </LoadingQuery>
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
