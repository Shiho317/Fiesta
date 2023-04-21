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

const EventPage: NextPageWithLayout = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <h1>Loading</h1>;
  }

  const { data: comingEvents } = api.event.getComingEventByUserId.useQuery({
    userId: session?.user.id as string,
  });
  const { data: pastEvents } = api.event.getPastEventByUserId.useQuery({
    userId: session?.user.id as string,
  });

  return (
    <Main className="grid grid-rows-2 gap-2 p-8">
      <div>
        <h1 className="text-3xl font-semibold text-gray-300">Coming Up</h1>
        {comingEvents && comingEvents.length > 0 ? (
          <EventTable events={comingEvents} />
        ) : (
          <Empty content="No Coming Up Events" />
        )}
      </div>
      <div>
        <h1 className="text-3xl font-semibold text-gray-300">Memory</h1>
        {pastEvents && pastEvents.length > 0 ? (
          <EventTable events={pastEvents} />
        ) : (
          <Empty content="No Past Events" />
        )}
      </div>
      <Link
        href={"/admin/events/new"}
        className="absolute bottom-10 right-10 bg-transparent text-fiesta-300 drop-shadow-lg hover:text-gray-300"
      >
        <PlusCircleIcon className="h-16 w-16" />
      </Link>
    </Main>
  );
};

EventPage.getLayout = (page) => {
  return (
    <AuthenticatedLayout>
      <>{page}</>
    </AuthenticatedLayout>
  );
};

export default EventPage;
