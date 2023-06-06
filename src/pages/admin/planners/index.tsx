import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";

import AuthenticatedLayout from "~/components/common/AuthenticatedLayout";
import Empty from "~/components/common/base/Empty";
import LoadingQuery from "~/components/common/base/LoadingQuery";
import Main from "~/components/common/base/Main";
import PlannerTable from "~/components/planners/PlannerTable";
import { api } from "~/utils/api";
import PaginationButton from "~/components/common/PaginationButton";

import { type NextPageWithLayout } from "~/types";

const FriendsPage: NextPageWithLayout = () => {
  const { data: session } = useSession();

  const [skipNum, setSkipNum] = useState<number>(0);
  const takeNum = 10;

  const { data: totalLength } = api.planner.getTotalLengthByUserId.useQuery({
    userId: session?.user.id as string,
  });

  const { data: plannerData, isLoading } =
    api.planner.getPlannerPaginated.useQuery({
      userId: session?.user.id as string,
      skip: skipNum,
      take: takeNum,
    });

  return (
    <LoadingQuery isLoading={isLoading}>
      <Main className="h-screen p-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-300">Planners</h1>
          {plannerData && plannerData.length > 0 ? (
            <>
              <PlannerTable planners={plannerData} />
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
            <Empty content="No Planners Exist." />
          )}
        </div>
        <Link
          href={"/admin/planners/new"}
          className="absolute bottom-20 right-5 bg-transparent text-fiesta-300 drop-shadow-lg hover:text-gray-300 laptop:bottom-10 laptop:right-10"
        >
          <PlusCircleIcon className="h-12 w-12 laptop:h-16 laptop:w-16" />
        </Link>
      </Main>
    </LoadingQuery>
  );
};

FriendsPage.getLayout = (page) => {
  return (
    <AuthenticatedLayout>
      <>{page}</>
    </AuthenticatedLayout>
  );
};

export default FriendsPage;
