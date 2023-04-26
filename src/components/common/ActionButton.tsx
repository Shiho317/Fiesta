import { type Row } from "@tanstack/react-table";
import Link from "next/link";
import React from "react";
import { PencilIcon } from "@heroicons/react/24/solid";

interface ActionButtonProp<T extends object> {
  row: Row<T>;
  id: string;
  path: string;
}

const ActionButton = <T extends object>({
  row,
  id,
  path,
}: ActionButtonProp<T>) => {
  const eventId = row.getValue(id);
  return (
    <Link href={`/admin/${path}/${eventId as string}`}>
      <PencilIcon className="h-5 w-5 text-fiesta-400 hover:text-fiesta-500" />
    </Link>
  );
};

export default ActionButton;
