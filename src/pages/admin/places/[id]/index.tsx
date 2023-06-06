import React from "react";

import AuthenticatedLayout from "~/components/common/AuthenticatedLayout";
import Main from "~/components/common/base/Main";
import PlaceForm from "~/components/places/PlaceForm";

import { type NextPageWithLayout } from "~/types";

const EditPlace: NextPageWithLayout = () => {
  return (
    <Main className="min-h-screen p-8">
      <h1 className="text-3xl font-semibold text-gray-300">Edit Place</h1>
      <PlaceForm />
    </Main>
  );
};

EditPlace.getLayout = (page) => {
  return (
    <AuthenticatedLayout>
      <>{page}</>
    </AuthenticatedLayout>
  );
};

export default EditPlace;
