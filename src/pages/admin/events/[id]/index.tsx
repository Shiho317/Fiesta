import { useRouter } from "next/router";
import React from "react";
import { toast } from "react-toastify";

import AuthenticatedLayout from "~/components/common/AuthenticatedLayout";
import Button from "~/components/common/base/Button";
import Main from "~/components/common/base/Main";
import EventForm from "~/components/events/EventForm";
import { api } from "~/utils/api";

import { type NextPageWithLayout } from "~/types";

const EditEvent: NextPageWithLayout = () => {
  // const router = useRouter();
  // const { id: eventId } = router.query;

  // const { mutate: deleteEvent } = api.event.deleteEvent.useMutation({
  //   onSuccess: () => {
  //     toast.success("Deleted event successfully.");
  //     void router.push("/admin/events");
  //   },
  //   onError: (error) => {
  //     toast.error(error.message);
  //   },
  // });

  // const { mutate: cancelEvent } = api.event.cancelEvent.useMutation({
  //   onSuccess: () => {
  //     toast.success("Canceled event successfully.");
  //   },
  //   onError: (error) => {
  //     toast.error(error.message);
  //   },
  // });

  // const onDeleteHandler = () => {
  //   deleteEvent({
  //     eventId: eventId as string,
  //   });
  // };

  // const onCancelHandler = () => {
  //   cancelEvent({
  //     eventId: eventId as string,
  //   });
  // };

  return (
    <Main className="p-8">
      <h1 className="text-3xl font-semibold text-gray-300">Edit Event</h1>
      {/* <Button
        content="Delete"
        type="button"
        className="absolute right-8 top-8 rounded-md border border-fiesta-900 bg-transparent px-8 text-fiesta-900 hover:bg-fiesta-900 hover:text-gray-300"
        onClick={onDeleteHandler}
      /> */}
      {/* <Button
        content="Cancel"
        type="button"
        className="absolute right-8 top-8 rounded-md border border-fiesta-900 bg-transparent px-8 text-fiesta-900 hover:bg-fiesta-900 hover:text-gray-300"
        onClick={onCancelHandler}
      /> */}
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
