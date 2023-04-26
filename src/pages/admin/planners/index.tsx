import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

import AuthenticatedLayout from "~/components/common/AuthenticatedLayout";
import Empty from "~/components/common/base/Empty";
import LoadingQuery from "~/components/common/base/LoadingQuery";
import Main from "~/components/common/base/Main";
import PlannerTable from "~/components/planners/PlannerTable";
import { api } from "~/utils/api";

import { type NextPageWithLayout } from "~/types";

const FriendsPage: NextPageWithLayout = () => {
  const { data: session } = useSession();

  const { data: plannerData, isLoading } =
    api.planner.getPlannerPaginated.useQuery({
      userId: session?.user.id as string,
    });

  return (
    <LoadingQuery isLoading={isLoading}>
      <Main className="p-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-300">Planners</h1>
          {plannerData && plannerData.length > 0 ? (
            <PlannerTable planners={plannerData} />
          ) : (
            <Empty content="No Planner Exists" />
          )}
        </div>
        <Link
          href={"/admin/planners/new"}
          className="absolute bottom-10 right-10 bg-transparent text-fiesta-300 drop-shadow-lg hover:text-gray-300"
        >
          <PlusCircleIcon className="h-16 w-16" />
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
