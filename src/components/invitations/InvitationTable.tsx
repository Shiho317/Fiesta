import { type ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import React, { useMemo } from "react";

import Table from "../common/base/Table";

type Invitation = {
  id: string;
  name: string;
  email: string;
  status: string;
  responseDate: string;
};

type InvitationTableProp = {
  invitations: {
    id: string;
    name: string;
    email: string;
    attend: boolean;
    respondedAt: Date | null;
  }[];
};

const InvitationTable = (props: InvitationTableProp) => {
  const { invitations } = props;

  const cols = useMemo<ColumnDef<Invitation>[]>(
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
        header: "Status",
        cell: (row) => row.renderValue(),
        accessorKey: "status",
      },
      {
        header: "Response Date",
        cell: (row) => row.renderValue(),
        accessorKey: "responseDate",
      },
    ],
    []
  );

  const tableData = () => {
    const items = [];

    for (let i = 0; i < invitations.length; i++) {
      let attendStatus;
      if (invitations[i]?.attend) {
        attendStatus = "Attend";
      } else if (!invitations[i]?.attend && !invitations[i]?.respondedAt) {
        attendStatus = "Waiting Response";
      } else {
        attendStatus = "Not Attend";
      }
      items.push({
        id: invitations[i]?.id as string,
        name: invitations[i]?.name as string,
        email: invitations[i]?.email as string,
        status: attendStatus,
        responseDate: invitations[i]?.respondedAt
          ? moment(invitations[i]?.respondedAt).format("MMM Do YYYY, h:mm a")
          : "",
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

export default InvitationTable;
