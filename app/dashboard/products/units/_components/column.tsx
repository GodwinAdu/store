"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action";

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "code",
    header: "Unique Code",
  },
  {
    accessorKey: "createdBy",
    header: "Created By",
    cell: ({ row }) => (
      <div>{row.original.createdBy?.username}</div>
    )
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];
