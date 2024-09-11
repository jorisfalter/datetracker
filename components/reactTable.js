"use client";

import React, { useState } from "react";
import {
  createColumnHelper,
  useReactTable,
  flexRender,
  getCoreRowModel,
} from "@tanstack/react-table";

export default function EditableReactTable() {
  const columnHelper = createColumnHelper();

  // Initial table data
  const [data, setData] = useState([
    { col1: "Hello", col2: "World" },
    { col1: "react-table", col2: "rocks" },
    { col1: "whatever", col2: "you want" },
  ]);

  // Track which cell is being edited (row index and column key)
  const [editingCell, setEditingCell] = useState({
    rowIdx: null,
    colKey: null,
  });

  // Handle updating the cell value
  const handleCellChange = (rowIdx, colKey, value) => {
    const updatedData = [...data];
    updatedData[rowIdx][colKey] = value;
    setData(updatedData);
  };

  // Define table columns
  const columns = [
    columnHelper.accessor("col1", {
      header: "Column 1",
      cell: (info) => {
        const rowIdx = info.row.index;
        return editingCell.rowIdx === rowIdx &&
          editingCell.colKey === "col1" ? (
          <input
            type="text"
            value={data[rowIdx]["col1"]}
            onChange={(e) => handleCellChange(rowIdx, "col1", e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setEditingCell({ rowIdx: null, colKey: null }); // Exit edit mode on Enter key
              }
            }}
            onBlur={() => setEditingCell({ rowIdx: null, colKey: null })} // Exit edit mode when focus is lost
            autoFocus
          />
        ) : (
          <span onClick={() => setEditingCell({ rowIdx, colKey: "col1" })}>
            {info.getValue()}
          </span>
        );
      },
    }),
    columnHelper.accessor("col2", {
      header: "Column 2",
      cell: (info) => {
        const rowIdx = info.row.index;
        return editingCell.rowIdx === rowIdx &&
          editingCell.colKey === "col2" ? (
          <input
            type="text"
            value={data[rowIdx]["col2"]}
            onChange={(e) => handleCellChange(rowIdx, "col2", e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setEditingCell({ rowIdx: null, colKey: null }); // Exit edit mode on Enter key
              }
            }}
            onBlur={() => setEditingCell({ rowIdx: null, colKey: null })} // Exit edit mode when focus is lost
            autoFocus
          />
        ) : (
          <span onClick={() => setEditingCell({ rowIdx, colKey: "col2" })}>
            {info.getValue()}
          </span>
        );
      },
    }),
  ];

  // Initialize table instance
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
