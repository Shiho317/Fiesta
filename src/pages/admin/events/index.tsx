import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

import AuthenticatedLayout from "~/components/common/AuthenticatedLayout";
import Empty from "~/components/common/base/Empty";
import Main from "~/components/common/base/Main";
import { api } from "~/utils/api";
import EventTable from "~/components/events/EventTable";

import { type NextPageWithLayout } from "~/types";
import LoadingQuery from "~/components/common/base/LoadingQuery";
import PaginationButton from "~/components/common/PaginationButton";

const EventPage: NextPageWithLayout = () => {
  const { data: session } = useSession();

  const [comingEventSkipNum, setComingEventSkipNum] = useState<number>(0);
  const comingEventTakeNum = 3;

  const [pastEventSkipNum, setPastEventSkipNum] = useState<number>(0);
  const pastEventTakeNum = 3;

  const { data: comingEventLength } =
    api.event.getTotalComingEventLengthByUserId.useQuery({
      userId: session?.user.id as string,
    });

  const { data: pastEventLength } =
    api.event.getTotalPastEventLengthByUserId.useQuery({
      userId: session?.user.id as string,
    });

  const { data: comingEvents } = api.event.getComingEventByUserId.useQuery({
    userId: session?.user.id as string,
    skip: comingEventSkipNum,
    take: comingEventTakeNum,
  });

  const { data: pastEvents, isLoading } =
    api.event.getPastEventByUserId.useQuery({
      userId: session?.user.id as string,
      skip: pastEventSkipNum,
      take: pastEventTakeNum,
    });

  return (
    <LoadingQuery isLoading={isLoading}>
      <Main className="grid grid-rows-2 gap-2 p-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-300">Coming Up</h1>
          {comingEvents && comingEvents.length > 0 ? (
            <>
              <EventTable events={comingEvents} />
              <div className="mt-4">
                <PaginationButton
                  start={comingEventSkipNum + 1}
                  end={comingEventSkipNum + comingEventTakeNum}
                  take={comingEventTakeNum}
                  total={comingEventLength as number}
                  skip={setComingEventSkipNum}
                />
              </div>
            </>
          ) : (
            <Empty content="No Coming Up Events" />
          )}
        </div>
        <div>
          <h1 className="text-3xl font-semibold text-gray-300">Memory</h1>
          {pastEvents && pastEvents.length > 0 ? (
            <>
              <EventTable events={pastEvents} />
              <div className="mt-4">
                <PaginationButton
                  start={pastEventSkipNum + 1}
                  end={pastEventSkipNum + pastEventTakeNum}
                  take={pastEventTakeNum}
                  total={pastEventLength as number}
                  skip={setPastEventSkipNum}
                />
              </div>
            </>
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
    </LoadingQuery>
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
