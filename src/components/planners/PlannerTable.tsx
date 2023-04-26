import { type ColumnDef } from "@tanstack/react-table";
import React, { useMemo } from "react";

import ActionButton from "../common/ActionButton";
import Table from "../common/base/Table";

type Planner = {
  id: string;
  name: string;
  email: string;
  phone: string;
  events: number;
  organization: string;
};

type PlannerProp = {
  planners: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    events: {
      id: string;
    }[];
    organization: string | null;
  }[];
};
const PlannerTable = (props: PlannerProp) => {
  const { planners } = props;

  const cols = useMemo<ColumnDef<Planner>[]>(
    () => [
      {
        header: "Name",
        cell: (row) => row.renderValue(),
        accessorKey: "name",
      },
      {
        header: "Email",
        cell: (row) => row.renderValue(),
        accessorKey: "email",
      },
      {
        header: "Phone",
        cell: (row) => row.renderValue(),
        accessorKey: "phone",
      },
      {
        header: "Company",
        cell: (row) => row.renderValue(),
        accessorKey: "organization",
      },
      {
        header: "Events",
        cell: (row) => row.renderValue(),
        accessorKey: "events",
      },
      {
        header: "",
        cell: (row) => (
          <ActionButton row={row.row} id={row.column.id} path="planners" />
        ),
        accessorKey: "id",
      },
    ],
    []
  );

  const tableData = () => {
    const items = [];
    for (let i = 0; i < planners.length; i++) {
      items.push({
        id: planners[i]?.id as string,
        name: planners[i]?.name as string,
        email: planners[i]?.email as string,
        phone: planners[i]?.phone as string,
        events: planners[i]?.events.length as number,
        organization: planners[i]?.organization as string,
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

export default PlannerTable;
