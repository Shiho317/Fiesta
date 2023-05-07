import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";

import AuthenticatedLayout from "~/components/common/AuthenticatedLayout";
import PaginationButton from "~/components/common/PaginationButton";
import Empty from "~/components/common/base/Empty";
import LoadingQuery from "~/components/common/base/LoadingQuery";
import Main from "~/components/common/base/Main";
import PlaceTable from "~/components/places/PlaceTable";
import { api } from "~/utils/api";

import { type NextPageWithLayout } from "~/types";

const PlacesPage: NextPageWithLayout = () => {
  const { data: session } = useSession();

  const [skipNum, setSkipNum] = useState<number>(0);
  const takeNum = 10;

  const { data: totalLength } = api.venue.getTotalLengthByUserId.useQuery({
    userId: session?.user.id as string,
  });

  const { data: placeData, isLoading } = api.venue.getVenuePaginated.useQuery({
    userId: session?.user.id as string,
    skip: skipNum,
    take: takeNum,
  });

  return (
    <LoadingQuery isLoading={isLoading}>
      <Main className="p-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-300">Places</h1>
          {placeData && placeData.length > 0 ? (
            <>
              <PlaceTable places={placeData} />
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
            <Empty content="No Places Exist." />
          )}
        </div>
        <Link
          href={"/admin/places/new"}
          className="absolute bottom-10 right-10 bg-transparent text-fiesta-300 drop-shadow-lg hover:text-gray-300"
        >
          <PlusCircleIcon className="h-16 w-16" />
        </Link>
      </Main>
    </LoadingQuery>
  );
};

PlacesPage.getLayout = (page) => {
  return (
    <AuthenticatedLayout>
      <>{page}</>
    </AuthenticatedLayout>
  );
};

export default PlacesPage;
