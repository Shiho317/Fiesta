import { type ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { toast } from "react-toastify";

import { api } from "~/utils/api";
import ActionButton from "../common/ActionButton";
import Table from "../common/base/Table";

type Place = {
  id: string;
  name: string;
  city: string;
  address: string;
  events: number;
};

type PlaceTableProp = {
  places: {
    id: string;
    name: string;
    city: string;
    address: string;
    event: {
      id: string;
    }[];
  }[];
};

const PlaceTable = (props: PlaceTableProp) => {
  const { places } = props;
  const router = useRouter();

  const { mutate: deletePlace } = api.venue.deleteById.useMutation({
    onSuccess: () => {
      toast.success("Deleted place successfully.");
      void router.reload();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteHandler = (id: string) => {
    deletePlace({
      id,
    });
  };

  const cols = useMemo<ColumnDef<Place>[]>(
    () => [
      {
        header: "Name",
        cell: (row) => row.renderValue(),
        accessorKey: "name",
      },
      {
        header: "City",
        cell: (row) => row.renderValue(),
        accessorKey: "city",
      },
      {
        header: "Address",
        cell: (row) => row.renderValue(),
        accessorKey: "address",
      },
      {
        header: "Events",
        cell: (row) => row.renderValue(),
        accessorKey: "events",
      },
      {
        header: "",
        cell: (row) => (
          <ActionButton
            row={row.row}
            id={row.column.id}
            path="places"
            type="edit"
          />
        ),
        accessorKey: "id",
      },
      {
        header: "",
        cell: (row) => (
          <ActionButton
            row={row.row}
            id={row.column.id}
            type="delete"
            onDelete={deleteHandler}
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
    for (let i = 0; i < places.length; i++) {
      items.push({
        id: places[i]?.id as string,
        name: places[i]?.name as string,
        city: places[i]?.city as string,
        address: places[i]?.address as string,
        events: places[i]?.event.length as number,
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

export default PlaceTable;
