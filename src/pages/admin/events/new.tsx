import React from "react";

import AuthenticatedLayout from "~/components/common/AuthenticatedLayout";
import Main from "~/components/common/base/Main";
import EventForm from "~/components/events/EventForm";

import { type NextPageWithLayout } from "~/types";

const NewEvent: NextPageWithLayout = () => {
  return (
    <Main className="p-8">
      <h1 className="text-3xl font-semibold text-gray-300">New Event</h1>
      <EventForm />
    </Main>
  );
};

NewEvent.getLayout = (page) => {
  return (
    <AuthenticatedLayout>
      <>{page}</>
    </AuthenticatedLayout>
  );
};

export default NewEvent;
