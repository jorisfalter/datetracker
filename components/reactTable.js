"use client";

import React from "react";
import {
  createColumnHelper,
  useReactTable,
  flexRender,
  getCoreRowModel,
} from "@tanstack/react-table";

export default function ReactTable() {
  // Create the column helper to define column data
  const columnHelper = createColumnHelper();

  // Table data
  const data = React.useMemo(
    () => [
      { col1: "Hello", col2: "World" },
      { col1: "react-table", col2: "rocks" },
      { col1: "whatever", col2: "you want" },
    ],
    []
  );

  // Define columns
  const columns = React.useMemo(
    () => [
      columnHelper.accessor("col1", {
        header: () => "Column 1",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("col2", {
        header: () => "Column 2",
        cell: (info) => info.getValue(),
      }),
    ],
    [columnHelper]
  );

  // Initialize the table instance
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table style={{ border: "1px solid black", width: "100%" }}>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                style={{ padding: "10px", border: "1px solid black" }}
              >
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td
                key={cell.id}
                style={{ padding: "10px", border: "1px solid black" }}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
