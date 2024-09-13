"use client";

import React, { useState, useEffect } from "react";
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
    { col1: "Fred the Example", col2: "Birthday", col3: 10, col4: "January" },
    {
      col1: "Tina and Gerard",
      col2: "Wedding Anniversary",
      col3: 20,
      col4: "October",
    },
    { col1: "...", col2: "...", col3: "", col4: "" },
  ]);

  // Track which cell is being edited (row index and column key)
  const [editingCell, setEditingCell] = useState({
    rowIdx: null,
    colKey: null,
  });

  // Email input state and timeout for inactivity
  const [email, setEmail] = useState("");
  const [timeoutId, setTimeoutId] = useState(null);
  const [submitted, setSubmitted] = useState(false); // Flag to prevent double submission

  // Email validation
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Function to submit data to the API
  const submitData = async () => {
    if (!submitted && isValidEmail(email)) {
      setSubmitted(true); // Mark as submitted

      try {
        const response = await fetch("/api/entries", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data, email }),
        });

        console.log(JSON.stringify({ data, email }));

        if (response.ok) {
          alert("Data sent to API successfully!");
        } else {
          alert("Failed to submit data.");
        }
      } catch (error) {
        console.error("Error submitting data:", error);
        alert("Error submitting data.");
      }
    }
  };

  // Handle email input change with a 5-second delay to auto-submit
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setSubmitted(false); // Reset submission flag when email changes

    // Clear any existing timeout to prevent premature submission
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Set a new timeout to auto-submit after 5 seconds of inactivity
    const newTimeoutId = setTimeout(() => {
      if (isValidEmail(e.target.value)) {
        submitData();
      }
    }, 5000);

    setTimeoutId(newTimeoutId);
  };

  // Handle blur event on the email input field
  const handleEmailBlur = () => {
    if (!submitted && isValidEmail(email)) {
      submitData();
    }
  };

  // Handle updating the cell value
  const handleCellChange = (rowIdx, colKey, value) => {
    const updatedData = [...data];
    updatedData[rowIdx][colKey] = value;
    setData(updatedData);
  };

  // Function to add a new empty row when editing the last row
  const addNewRow = (rowIdx) => {
    if (rowIdx === data.length - 1) {
      setData((prevData) => [
        ...prevData,
        { col1: "...", col2: "", col3: "", col4: "" },
      ]);
    }
  };

  // Define table columns
  const columns = [
    columnHelper.accessor("col1", {
      header: "Who?",
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
          <span>{info.getValue()}</span>
        );
      },
    }),

    columnHelper.accessor("col2", {
      header: "What?",
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
          <span>{info.getValue()}</span>
        );
      },
    }),

    columnHelper.accessor("col3", {
      header: "Day",
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
          <span>{info.getValue()}</span>
        );
      },
    }),

    columnHelper.accessor("col4", {
      header: "Month",
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
            <option value="January">January</option>
            <option value="February">February</option>
            <option value="March">March</option>
            <option value="April">April</option>
            <option value="May">May</option>
            <option value="June">June</option>
            <option value="July">July</option>
            <option value="August">August</option>
            <option value="September">September</option>
            <option value="October">October</option>
            <option value="November">November</option>
            <option value="December">December</option>
          </select>
        ) : (
          <span>{info.getValue()}</span>
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
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {/* Centers both the table and email input */}
      <table
        style={{
          border: "1px solid black",
          width: "80%",
          tableLayout: "fixed", // Fixes the column width
          backgroundColor: "#f5f5f5", // Different background color
          textAlign: "center",
        }}
      >
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  style={{
                    padding: "10px",
                    border: "1px solid black",
                    width: "25%", // Equal width for all columns
                  }}
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
            <tr
              key={row.id}
              style={{ cursor: "pointer" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#e0e0e0"; // Hover color
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = ""; // Reset color on mouse leave
              }}
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  style={{
                    padding: "10px",
                    border: "1px solid black",
                    width: "25%", // Equal width for all cells
                  }}
                  onClick={() => {
                    setEditingCell({
                      rowIdx: row.index,
                      colKey: cell.column.id,
                    });
                    addNewRow(row.index); // Add a new row when clicking the last row
                  }}
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
          onBlur={handleEmailBlur} // Submit on blur
          placeholder="Enter your email"
          style={{ padding: "5px", marginTop: "10px", width: "200px" }}
        />
      </div>
    </div>
  );
}
