import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import Input from "../common/base/Input";
import Button from "../common/base/Button";
import { api } from "~/utils/api";
import moment from "moment";

type EventInputProp = {
  name: string;
  eventDate: Date;
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
  const { data: session, status } = useSession();

  // if(status === "loading"){
  //   return;
  // }

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

  const { mutate: createEvent } = api.event.createEvent.useMutation({
    onSuccess: () => {
      toast.success("Congrats!!🎉 You successfully created new event.");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const [venueId, setVenueId] = useState<string>();
  const [plannerId, setPlannerId] = useState<string>();

  const venueOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const splitNameAndAddress = value.split(" / ");
    const id = splitNameAndAddress[1]?.trim();
    const venueDataFromDB = eventVenues?.find((venue) => venue.id === id);
    if (venueDataFromDB) {
      setVenueId(venueDataFromDB.id);
      setValue("venueName", venueDataFromDB.name);
      setValue("country", venueDataFromDB.country);
      setValue("state_province", venueDataFromDB.state_province);
      setValue("city", venueDataFromDB.city);
      setValue("address", venueDataFromDB.address);
      setValue("zipcode", venueDataFromDB.zipcode);
    }
  };

  const plannerOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const splitEmailAndName = value.split(" / ");
    const email = splitEmailAndName[0]?.trim();
    const plannerDataFromDB = eventPlanners?.find(
      (planner) => planner.email === email
    );
    if (plannerDataFromDB) {
      setPlannerId(plannerDataFromDB.id);
      setValue("plannerName", plannerDataFromDB.name);
      setValue("plannerEmail", plannerDataFromDB.email);
    }
  };

  const onSubmit = (data: EventInputProp) => {
    const { name, eventDate, venueName, plannerEmail, plannerName, ...rest } =
      data;
    createEvent({
      hostId: session?.user.id as string,
      name,
      eventDate: moment(eventDate).toDate(),
      venueId,
      venueName,
      plannerId,
      plannerName,
      plannerEmail,
      ...rest,
    });
  };

  useEffect(() => {
    if (eventData && !error) {
      setValue("name", eventData.name);
      setValue("eventDate", eventData.eventDate);
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
    <div className="relative z-10 mt-4 rounded-lg border border-gray-200 bg-fiesta-100/30 p-4 shadow-md shadow-gray-300/30 backdrop-blur-md backdrop-filter">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-4"
      >
        <Input
          type="text"
          name="name"
          label="Event Name"
          placeholder="Amy's 7th Birthday Party"
          required={true}
          register={register}
        />
        <Input
          type="datetime-local"
          name="eventDate"
          label="Event Date"
          required={true}
          register={register}
        />
        <h1 className="col-span-2 text-xl text-gray-500">
          Event Venue (Optional)
        </h1>
        <Input
          type="text"
          name="venueName"
          label="Venue"
          placeholder="David Lam Park"
          list="eventVenue"
          onChangeHandler={(e: React.ChangeEvent<HTMLInputElement>) =>
            venueOnChange(e)
          }
          // register={register}
          {...register}
        >
          <datalist id="eventVenue">
            {eventVenues &&
              eventVenues.map((venue) => (
                <option key={venue.id} value={`${venue.name} / ${venue.id}`}>
                  {venue.address}
                </option>
              ))}
          </datalist>
        </Input>
        <Input
          type="text"
          name="address"
          label="Address"
          placeholder="1300 Pacific Blvd"
          register={register}
        />
        <Input
          type="text"
          name="city"
          label="City"
          placeholder="Vancouver"
          register={register}
        />
        <Input
          type="text"
          name="state_province"
          label="State / Province"
          placeholder="BC"
          register={register}
        />
        <Input
          type="text"
          name="country"
          label="Country"
          placeholder="Canada"
          register={register}
        />
        <Input
          type="text"
          name="zipcode"
          label="Zip Code"
          placeholder="V6Z 2Y1"
          register={register}
        />
        <h1 className="col-span-2 text-xl text-gray-500">
          Event Planner (Optional)
        </h1>
        <Input
          type="email"
          name="plannerEmail"
          label="Email"
          list="eventPlanner"
          placeholder="janesmith@fiesta.com"
          onChangeHandler={(e: React.ChangeEvent<HTMLInputElement>) =>
            plannerOnChange(e)
          }
          {...register}
        >
          <datalist id="eventPlanner">
            {eventPlanners &&
              eventPlanners.map((planner) => (
                <option
                  key={planner.id}
                  value={`${planner.email} / ${planner.name}`}
                />
              ))}
          </datalist>
        </Input>
        <Input
          type="text"
          label="Name"
          name="plannerName"
          placeholder="Jane Smith"
          register={register}
        />
        <div className="col-span-2 mt-4 flex justify-between">
          <Button
            type="button"
            content="Back"
            className="rounded-md bg-gray-300 px-8 hover:bg-gray-200"
          />
          <Button type="submit" content="Save" className="rounded-md px-8" />
        </div>
      </form>
    </div>
  );
};

export default EventForm;
