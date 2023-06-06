import { useSession } from "next-auth/react";
import React from "react";

import Empty from "../common/base/Empty";
import { api } from "~/utils/api";
import EventChart from "./EventChart";
import GuestChart from "./GuestChart";

const UserChart = () => {
  const { data: session } = useSession();
  const userId = session?.user.id;

  const { data: totalLength } = api.event.getTotalCount.useQuery({
    userId: userId as string,
  });

  return (
    <>
      {totalLength && totalLength > 0 ? (
        <div className="relative z-10 mt-4 grid items-center gap-10 rounded-lg border border-gray-200 bg-fiesta-100/30 p-4 shadow-md shadow-gray-300/30 backdrop-blur-md backdrop-filter laptop:grid-cols-2 laptop:gap-4 desktop:row-span-3">
          <EventChart />
          <GuestChart />
        </div>
      ) : (
        <div className="relative z-10 row-span-3 mt-4 rounded-lg border border-gray-200 bg-fiesta-100/30 p-4 shadow-md shadow-gray-300/30 backdrop-blur-md backdrop-filter">
          <Empty content="There is no statistics of your event." />
        </div>
      )}
    </>
  );
};

export default UserChart;
