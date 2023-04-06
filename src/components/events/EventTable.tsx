import React, { useMemo } from "react";

import { type EventStatus } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";
import Table from "../common/base/Table";
import moment from "moment";

type Event = {
  name: string;
  status: string;
  date: string;
  guests: number;
  venue: string;
};

type EventProp = {
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

const EventTable = (props: EventProp) => {
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
    ],
    []
  );

  const tableData = () => {
    const items = [];
    for (let i = 0; i < 10; i++) {
      items.push({
        name: props[i]?.name as string,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        status: props[i]?.status as string,
        date: moment(props[i]?.eventDate).format("MMM Do YYYY, h:mm a"),
        guests: props[i]?.guests.length as number,
        venue: props[i]?.venue?.name as string,
      });
    }
    return items;
  };

  return (
    <div>
      <Table data={tableData()} columns={cols} />
    </div>
  );
};

export default EventTable;
