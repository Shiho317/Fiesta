import React, { useMemo } from "react";
import moment from "moment";
import { type EventStatus } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";

import Table from "../common/base/Table";
import ActionButton from "../common/ActionButton";

type Event = {
  id: string;
  name: string;
  status: string;
  date: string;
  guests: number;
  venue: string;
};

type EventProp = {
  events: {
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
  }[];
};

const EventTable = (props: EventProp) => {
  const { events } = props;

  const cols = useMemo<ColumnDef<Event>[]>(
    () => [
      {
        header: "Name",
        cell: (row) => row.renderValue(),
        accessorKey: "name",
      },
      {
        header: "Guests",
        cell: (row) => row.renderValue(),
        accessorKey: "guests",
      },
      {
        header: "Place",
        cell: (row) => row.renderValue(),
        accessorKey: "venue",
      },
      {
        header: "Status",
        cell: (row) => row.renderValue(),
        accessorKey: "status",
      },
      {
        header: "Date",
        cell: (row) => row.renderValue(),
        accessorKey: "date",
      },
      {
        header: "",
        cell: (row) => (
          <ActionButton
            row={row.row}
            id={row.column.id}
            path="events"
            type="edit"
          />
        ),
        accessorKey: "id",
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const tableData = () => {
    const items = [];
    for (let i = 0; i < events.length; i++) {
      items.push({
        id: events[i]?.id as string,
        name: events[i]?.name as string,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        status: events[i]?.status as string,
        date: moment(events[i]?.eventDate).format("MMM Do YYYY, h:mm a"),
        guests: events[i]?.guests.length as number,
        venue: events[i]?.venue?.name as string,
      });
    }
    return items;
  };

  return (
    <>
      <Table data={tableData()} columns={cols} />
    </>
  );
};

export default EventTable;
