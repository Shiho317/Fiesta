import { type Row } from "@tanstack/react-table";
import Link from "next/link";
import React from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

interface ActionButtonProp<T extends object> {
  row: Row<T>;
  id: string;
  path?: string;
  type: "edit" | "delete";
  onDelete?: (id: string) => void;
}

const ActionButton = <T extends object>({
  row,
  id,
  path,
  type,
  onDelete,
}: ActionButtonProp<T>) => {
  const targetId = row.getValue(id);
  return (
    <>
      {type === "edit" ? (
        <Link href={`/admin/${path as string}/${targetId as string}`}>
          <PencilIcon className="h-5 w-5 text-fiesta-300 hover:text-fiesta-500" />
        </Link>
      ) : (
        <button type="button" onClick={() => onDelete?.(targetId as string)}>
          <TrashIcon className="h-5 w-5 text-rose-300 hover:text-rose-500" />
        </button>
      )}
    </>
  );
};

export default ActionButton;
