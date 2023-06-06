import React from "react";

import AuthenticatedLayout from "~/components/common/AuthenticatedLayout";
import Main from "~/components/common/base/Main";
import PlaceForm from "~/components/places/PlaceForm";

import { type NextPageWithLayout } from "~/types";

const NewPlace: NextPageWithLayout = () => {
  return (
    <Main className="p-8">
      <h1 className="text-3xl font-semibold text-gray-300">New Place</h1>
      <PlaceForm />
    </Main>
  );
};

NewPlace.getLayout = (page) => {
  return (
    <AuthenticatedLayout>
      <>{page}</>
    </AuthenticatedLayout>
  );
};

export default NewPlace;
