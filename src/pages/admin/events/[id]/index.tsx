import React from "react";

import AuthenticatedLayout from "~/components/common/AuthenticatedLayout";
import Main from "~/components/common/base/Main";
import EventForm from "~/components/events/EventForm";

import { type NextPageWithLayout } from "~/types";

const EditEvent: NextPageWithLayout = () => {
  return (
    <Main className="min-h-screen p-8">
      <h1 className="text-3xl font-semibold text-gray-300">Edit Event</h1>
      <EventForm />
    </Main>
  );
};

EditEvent.getLayout = (page) => {
  return (
    <AuthenticatedLayout>
      <>{page}</>
    </AuthenticatedLayout>
  );
};

export default EditEvent;
