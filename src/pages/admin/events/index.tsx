import { useSession } from "next-auth/react";
import React from "react";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

import AuthenticatedLayout from "~/components/common/AuthenticatedLayout";
import Empty from "~/components/common/base/Empty";
import Main from "~/components/common/base/Main";
import { api } from "~/utils/api";
import EventTable from "~/components/events/EventTable";

import { type NextPageWithLayout } from "~/types";

const EventBoard: NextPageWithLayout = () => {
  const { data: session } = useSession();
  const { data: comingEvents } = api.event.getComingEventByUserId.useQuery({
    userId: session?.user.id as string,
  });
  const { data: pastEvents } = api.event.getPastEventByUserId.useQuery({
    userId: session?.user.id as string,
  });

  return (
    <Main className="grid grid-rows-2 gap-2 p-8">
      {comingEvents && comingEvents.length > 0 ? (
        <EventTable {...comingEvents} />
      ) : (
        <Empty title="Coming Up" content="No Coming Up Events" />
      )}
      {pastEvents && pastEvents.length > 0 ? (
        <EventTable {...pastEvents} />
      ) : (
        <Empty title="Memory" content="No Past Events" />
      )}
      <Link
        href={"/admin/events/new"}
        className="absolute bottom-10 right-10 bg-transparent text-fiesta-300 drop-shadow-lg hover:text-gray-300"
      >
        <PlusCircleIcon className="h-16 w-16" />
      </Link>
    </Main>
  );
};

EventBoard.getLayout = (page) => {
  return (
    <AuthenticatedLayout>
      <>{page}</>
    </AuthenticatedLayout>
  );
};

export default EventBoard;
