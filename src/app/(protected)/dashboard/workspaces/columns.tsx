"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export type User = {
  gid: string;
  name: string;
  email: string;
  photo: { image_36x36: string };
};

export const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "photo.image_36x36",
    header: "Photo",
    cell: ({ row }) => {
      return row.original.photo?.image_36x36 ? (
        <Image
          src={row.original.photo.image_36x36}
          alt={row.original.name}
          width={36}
          height={36}
          className='rounded-full'
        />
      ) : null;
    },
  },
];
