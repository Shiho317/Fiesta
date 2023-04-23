import { type EventStatus } from "@prisma/client";
import moment from "moment";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import { ChevronDoubleRightIcon } from "@heroicons/react/24/solid";

type EventProp = {
  event: {
    id: string;
    name: string;
    status: EventStatus;
    hostId: string;
    eventDate: Date;
    guests: {
      id: string;
    }[];
    venue: {
      name: string;
    } | null;
  };
};

const InvitationBoard = (props: EventProp) => {
  const { event } = props;

  const statusType = {
    completed: "COMPLETED",
    canceled: "CANCELED",
    planning: "PLANNING",
  };

  const [eventStatus, setEventStatus] = useState<string>(statusType.planning);

  useEffect(() => {
    switch (event.status) {
      case statusType.completed:
        setEventStatus("green");
        break;
      case statusType.planning:
        setEventStatus("blue");
        break;
      case statusType.canceled:
        setEventStatus("red");
        break;
    }
  }, [event, statusType.canceled, statusType.completed, statusType.planning]);

  return (
    <div className="relative z-10 mt-4 rounded-lg border border-gray-200 bg-fiesta-100/30 p-4 shadow-md shadow-gray-300/30 backdrop-blur-md backdrop-filter hover:shadow-lg">
      <h3 className="font-regular text-lg">{event.name}</h3>
      <p
        className={`my-2 w-fit rounded-xl px-2 py-1 text-xs text-white ${
          eventStatus === "green"
            ? "bg-green-200"
            : eventStatus === "red"
            ? "bg-red-200"
            : "bg-blue-200"
        }`}
      >
        {event.status}
      </p>
      <p className="my-1 text-sm text-gray-400">{event.venue?.name ?? ""}</p>
      <p className="my-1 text-sm text-gray-400">
        {moment(event.eventDate).format("MMM Do YYYY, h:mm a").toString()}
      </p>
      <p className="my-1 text-sm text-gray-400">
        Invited Guests: {event.guests.length}
      </p>
      <Link
        href={`/admin/invitations/list/${event.id}`}
        className="flex items-center gap-2 text-fiesta-300 hover:text-fiesta-400"
      >
        <p className="text-sm">See All Invitation List</p>
        <ChevronDoubleRightIcon className="h-3 w-3" />
      </Link>
    </div>
  );
};

export default InvitationBoard;
