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
    { col1: "Hello", col2: "World", col3: 10, col4: "Option1" },
    { col1: "react-table", col2: "rocks", col3: 20, col4: "Option2" },
    { col1: "whatever", col2: "you want", col3: 30, col4: "Option1" },
  ]);

  // Track which cell is being edited (row index and column key)
  const [editingCell, setEditingCell] = useState({
    rowIdx: null,
    colKey: null,
  });

  // Email input state
  const [email, setEmail] = useState("");

  // Handle updating the cell value
  const handleCellChange = (rowIdx, colKey, value) => {
    const updatedData = [...data];
    updatedData[rowIdx][colKey] = value;
    setData(updatedData);
  };

  // Handle email input change
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  // Define table columns
  const columns = [
    columnHelper.accessor("col1", {
      header: "Column 1 (String)",
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
                setEditingCell({ rowIdx: null, colKey: null });
              }
            }}
            onBlur={() => setEditingCell({ rowIdx: null, colKey: null })}
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
      header: "Column 2 (String)",
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
                setEditingCell({ rowIdx: null, colKey: null });
              }
            }}
            onBlur={() => setEditingCell({ rowIdx: null, colKey: null })}
            autoFocus
          />
        ) : (
          <span onClick={() => setEditingCell({ rowIdx, colKey: "col2" })}>
            {info.getValue()}
          </span>
        );
      },
    }),
    columnHelper.accessor("col3", {
      header: "Column 3 (Int)",
      cell: (info) => {
        const rowIdx = info.row.index;
        return editingCell.rowIdx === rowIdx &&
          editingCell.colKey === "col3" ? (
          <input
            type="number"
            value={data[rowIdx]["col3"]}
            onChange={(e) => handleCellChange(rowIdx, "col3", e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setEditingCell({ rowIdx: null, colKey: null });
              }
            }}
            onBlur={() => setEditingCell({ rowIdx: null, colKey: null })}
            autoFocus
          />
        ) : (
          <span onClick={() => setEditingCell({ rowIdx, colKey: "col3" })}>
            {info.getValue()}
          </span>
        );
      },
    }),
    columnHelper.accessor("col4", {
      header: "Column 4 (Dropdown)",
      cell: (info) => {
        const rowIdx = info.row.index;
        return editingCell.rowIdx === rowIdx &&
          editingCell.colKey === "col4" ? (
          <select
            value={data[rowIdx]["col4"]}
            onChange={(e) => handleCellChange(rowIdx, "col4", e.target.value)}
            onBlur={() => setEditingCell({ rowIdx: null, colKey: null })}
            autoFocus
          >
            <option value="Option1">Option 1</option>
            <option value="Option2">Option 2</option>
            <option value="Option3">Option 3</option>
          </select>
        ) : (
          <span onClick={() => setEditingCell({ rowIdx, colKey: "col4" })}>
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
    <div>
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

      {/* Email Input Field */}
      <div style={{ marginTop: "20px" }}>
        <label htmlFor="email">Your Email: </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="Enter your email"
          style={{ padding: "5px", marginTop: "10px", width: "300px" }}
        />
      </div>
    </div>
  );
}
