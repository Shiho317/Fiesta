import moment from "moment";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import { ChevronDoubleRightIcon } from "@heroicons/react/24/solid";
import { EventStatusColor, EventStatusType } from "~/utils/enum";

type EventProp = {
  event: {
    id: string;
    name: string;
    status: EventStatusType;
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

  const [eventStatusColor, setEventStatusColor] = useState<string>(
    EventStatusColor.PLANNING
  );

  useEffect(() => {
    switch (event.status) {
      case EventStatusType.COMPLETED:
        setEventStatusColor(EventStatusColor.COMPLETED);
        break;
      case EventStatusType.PLANNING:
        setEventStatusColor(EventStatusColor.PLANNING);
        break;
      case EventStatusType.CANCELED:
        setEventStatusColor(EventStatusColor.CANCELED);
        break;
      default:
        setEventStatusColor(EventStatusColor.PLANNING);
    }
  }, [event]);

  return (
    <div className="relative z-10 mt-4 rounded-lg border border-gray-200 bg-fiesta-100/30 p-4 shadow-md shadow-gray-300/30 backdrop-blur-md backdrop-filter hover:shadow-lg">
      <h3 className="font-regular text-lg">{event.name}</h3>
      <p
        className={`my-2 w-fit rounded-xl px-2 py-1 text-xs text-white ${eventStatusColor}`}
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
