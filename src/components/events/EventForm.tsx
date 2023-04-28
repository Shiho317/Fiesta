import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import moment from "moment";

import Input from "../common/base/Input";
import Button from "../common/base/Button";
import { api } from "~/utils/api";
import Modal from "../common/base/Modal";

type EventInputProp = {
  name: string;
  eventDate: Date | string;
  venueName?: string;
  country?: string;
  state_province?: string;
  city?: string;
  address?: string;
  zipcode?: string;
  plannerName?: string;
  plannerEmail?: string;
};

const EventForm = () => {
  const { data: session } = useSession();

  const { register, handleSubmit, setValue } = useForm<EventInputProp>();
  const router = useRouter();
  const { id: eventId } = router.query;

  const { data: eventData, error } = api.event.getById.useQuery({
    id: eventId ? (eventId as string) : "",
  });

  const { data: eventVenues } = api.venue.getAllByUser.useQuery({
    userId: session?.user.id as string,
  });

  const { data: eventPlanners } = api.planner.getAllByUser.useQuery({
    userId: session?.user.id as string,
  });

  const { mutate: upsertEvent } = api.event.upsertEvent.useMutation({
    onSuccess: () => {
      toast.success("Congrats!!🎉 You successfully saved event.");
      void router.push("/admin/events");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const [openModal, setOpenModal] = useState<boolean>(false);

  const { mutate: deleteEvent } = api.event.deleteEvent.useMutation({
    onSuccess: () => {
      toast.success("Deleted event successfully.");
      void router.push("/admin/events");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: cancelEvent } = api.event.cancelEvent.useMutation({
    onSuccess: () => {
      toast.success("Canceled event successfully.");
      void router.push("/admin/events");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onDeleteHandler = () => {
    deleteEvent({
      eventId: eventId as string,
    });
  };

  const openWarningModal = () => {
    setOpenModal(true);
  };

  const closeWarningModal = () => {
    setOpenModal(false);
  };

  const onCancelHandler = () => {
    cancelEvent({
      eventId: eventId as string,
      eventName: eventData?.name as string,
      eventDate: moment(eventData?.eventDate).toDate(),
      email: session?.user.email as string,
      name: session?.user.name as string,
    });
  };

  const [venueId, setVenueId] = useState<string>();
  const [venueFromList, setVenueFromList] = useState<boolean>(false);

  const venueOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const venueDataFromDB = eventVenues?.find((venue) => venue.id === value);
    setVenueId(venueDataFromDB?.id ?? "");
    setValue("venueName", venueDataFromDB?.name ?? "");
    setValue("country", venueDataFromDB?.country ?? "");
    setValue("state_province", venueDataFromDB?.state_province ?? "");
    setValue("city", venueDataFromDB?.city ?? "");
    setValue("address", venueDataFromDB?.address ?? "");
    setValue("zipcode", venueDataFromDB?.zipcode ?? "");
    if (venueDataFromDB) {
      setVenueFromList(true);
    } else {
      setVenueFromList(false);
    }
  };

  const [plannerFromList, setPlannerFromList] = useState<boolean>(false);
  const [plannerId, setPlannerId] = useState<string>();

  const plannerOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const plannerDataFromDB = eventPlanners?.find(
      (planner) => planner.id === value
    );
    setPlannerId(plannerDataFromDB?.id ?? "");
    setValue("plannerName", plannerDataFromDB?.name ?? "");
    setValue("plannerEmail", plannerDataFromDB?.email ?? "");
    setPlannerFromList(true);

    if (plannerDataFromDB) {
      setPlannerFromList(true);
    } else {
      setPlannerFromList(false);
    }
  };

  const onSubmit = (data: EventInputProp) => {
    const { name, eventDate, venueName, plannerEmail, plannerName, ...rest } =
      data;

    upsertEvent({
      eventId: eventId as string,
      hostId: session?.user.id as string,
      name,
      eventDate: moment(eventDate).toDate(),
      venueId,
      venueName,
      plannerName,
      plannerEmail,
      plannerId,
      ...rest,
    });
  };

  useEffect(() => {
    if (eventData && !error) {
      const yearAndDate = moment(eventData?.eventDate).format("YYYY-MM-DD");
      const timeAndSecond = moment(eventData?.eventDate).format("HH:mm");
      setValue("name", eventData.name);
      setValue("eventDate", `${yearAndDate}T${timeAndSecond}`);
      setValue("venueName", eventData.venue?.name);
      setValue("address", eventData.venue?.address);
      setValue("country", eventData.venue?.country);
      setValue("city", eventData.venue?.city);
      setValue("state_province", eventData.venue?.state_province);
      setValue("zipcode", eventData.venue?.zipcode);
      setValue("plannerName", eventData.planner?.name);
      setValue("plannerEmail", eventData.planner?.email);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventData]);

  return (
    <>
      {(eventData && eventData.canceled) ||
      (eventData && eventData.guests.length === 0) ? (
        <Button
          content="Delete"
          type="button"
          className="absolute right-8 top-8 rounded-md border border-fiesta-900 bg-transparent px-8 text-fiesta-900 hover:bg-fiesta-900 hover:text-gray-300"
          onClick={onDeleteHandler}
        />
      ) : (
        <Button
          content="Cancel"
          type="button"
          className="absolute right-8 top-8 rounded-md border border-fiesta-900 bg-transparent px-8 text-fiesta-900 hover:bg-fiesta-900 hover:text-gray-300"
          onClick={openWarningModal}
        />
      )}
      <div className="relative z-10 mt-4 rounded-lg border border-gray-200 bg-fiesta-100/30 p-4 shadow-md shadow-gray-300/30 backdrop-blur-md backdrop-filter">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-2"
        >
          <Input
            type="text"
            name="name"
            label="Event Name"
            placeholder="Amy's 7th Birthday Party"
            required={true}
            register={register}
            readOnly={eventData?.canceled ?? false}
          />
          <Input
            type="datetime-local"
            name="eventDate"
            label="Event Date"
            required={true}
            register={register}
            readOnly={eventData?.canceled ?? false}
          />
          <h1 className="col-span-2 text-xl text-gray-500">
            Event Venue (Optional)
          </h1>
          <select
            className="col-start-1 col-end-2 p-3"
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              venueOnChange(e)
            }
            disabled={eventData?.canceled ?? false}
          >
            <option>Select from your venue list</option>
            {eventVenues &&
              eventVenues.map((venue) => (
                <option key={venue.id} value={venue.id}>
                  {venue.name}
                </option>
              ))}
          </select>
          <Input
            type="text"
            name="venueName"
            label="Venue"
            placeholder="David Lam Park"
            list="eventVenue"
            className="col-start-1 col-end-2"
            register={register}
            readOnly={venueFromList || eventData?.canceled ? true : false}
          />
          <Input
            type="text"
            name="address"
            label="Address"
            placeholder="1300 Pacific Blvd"
            register={register}
            readOnly={venueFromList || eventData?.canceled ? true : false}
          />
          <Input
            type="text"
            name="city"
            label="City"
            placeholder="Vancouver"
            register={register}
            readOnly={venueFromList || eventData?.canceled ? true : false}
          />
          <Input
            type="text"
            name="state_province"
            label="State / Province"
            placeholder="BC"
            register={register}
            readOnly={venueFromList || eventData?.canceled ? true : false}
          />
          <Input
            type="text"
            name="country"
            label="Country"
            placeholder="Canada"
            register={register}
            readOnly={venueFromList || eventData?.canceled ? true : false}
          />
          <Input
            type="text"
            name="zipcode"
            label="Zip Code"
            placeholder="V6Z 2Y1"
            register={register}
            readOnly={venueFromList || eventData?.canceled ? true : false}
          />
          <h1 className="col-span-2 text-xl text-gray-500">
            Event Planner (Optional)
          </h1>
          <select
            className="col-start-1 col-end-2 p-3"
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              plannerOnChange(e)
            }
            disabled={eventData?.canceled ?? false}
          >
            <option>Select from your planner list</option>
            {eventPlanners &&
              eventPlanners.map((planner) => (
                <option key={planner.id} value={planner.id}>
                  {planner.name}
                </option>
              ))}
          </select>
          <Input
            type="email"
            name="plannerEmail"
            label="Email"
            list="eventPlanner"
            placeholder="janesmith@fiesta.com"
            className="col-start-1 col-end-2"
            register={register}
            readOnly={plannerFromList || eventData?.canceled ? true : false}
          />
          <Input
            type="text"
            label="Name"
            name="plannerName"
            placeholder="Jane Smith"
            register={register}
            readOnly={plannerFromList || eventData?.canceled ? true : false}
          />
          <div className="col-span-2 mt-4 flex justify-between">
            <Button
              type="button"
              content="Back"
              className="rounded-md bg-gray-300 px-8 hover:bg-gray-200"
              onClick={() => void router.push("/admin/events")}
            />
            <Button
              type="submit"
              content="Save"
              className="rounded-md px-8"
              disabled={eventData?.canceled ?? false}
            />
          </div>
        </form>
      </div>
      {openModal && (
        <Modal
          content="Once you canceled event, you can't restore. We will send cancel email to all guests who was supposed to attend this event. Are you sure you want to cancel this event?"
          proceedLabel="Yes, I'm sure"
          cancelLabel="No, I'm not"
          proceedHandler={onCancelHandler}
          closeModal={closeWarningModal}
        />
      )}
    </>
  );
};

export default EventForm;
