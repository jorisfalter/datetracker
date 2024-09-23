"use client";

import React, { useState, useEffect } from "react";
import {
  createColumnHelper,
  useReactTable,
  flexRender,
  getCoreRowModel,
} from "@tanstack/react-table";
// import styles from "../app/reactTable.module.css";

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

  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Email validation
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Function to submit data to the API
  const submitData = async (updatedData) => {
    if (isValidEmail(email)) {
      try {
        const dataWithDate = updatedData.map((row) => {
          const monthIndex =
            [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ].indexOf(row.col4) + 1;
          const day = row.col3.toString().padStart(2, "0");
          const month = monthIndex.toString().padStart(2, "0");
          return {
            ...row,
            date: `${month}-${day}`,
          };
        });
        // console.log(dataWithDate);

        const response = await fetch("/api/entries", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: dataWithDate, email }),
        });

        console.log(JSON.stringify({ data: dataWithDate, email }));

        if (response.ok) {
          console.log("Data sent to API successfully!");
        } else {
          console.error("Failed to submit data.");
        }
      } catch (error) {
        console.error("Error submitting data:", error);
      }
    } else {
      console.error("Invalid email, cannot submit data.");
    }
  };

  // Handle cell value changes
  const handleCellChange = (rowIdx, colKey, value) => {
    const updatedData = [...data];
    updatedData[rowIdx][colKey] = value;
    setData(updatedData);
  };

  // Handle cell blur event (when user clicks away from a cell)
  const handleCellBlur = (rowIdx, colKey) => {
    // Submit data when the user finishes editing a cell
    submitData(data);
    setEditingCell({ rowIdx: null, colKey: null });
  };

  // Handle email input change
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setSubmitted(false);
  };

  // Handle email input blur (when user clicks away from the email input)
  const handleEmailBlur = () => {
    // Submit data when the user finishes entering the email
    submitData(data);
  };

  const handleKeyDown = (e, rowIdx, colKey) => {
    if (e.key === "Tab") {
      e.preventDefault(); // Prevent the default tab behavior

      // Determine the next cell's row and column based on the current position
      let nextRowIdx = rowIdx;
      let nextColKey = colKey;

      // Define the order of columns (you can adjust this as needed)
      const columns = ["col1", "col2", "col3", "col4"];
      const currentColIndex = columns.indexOf(colKey);

      if (currentColIndex < columns.length - 1) {
        // Move to the next column in the same row
        nextColKey = columns[currentColIndex + 1];
      } else {
        // Move to the first column of the next row
        nextRowIdx = rowIdx + 1;
        nextColKey = columns[0];
      }

      // Set focus to the next cell
      setEditingCell({ rowIdx: nextRowIdx, colKey: nextColKey });
    }
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent the default behavior
      setEditingCell({ rowIdx: null, colKey: null }); // Exit editing mode
    }
    // Doesn't work yet // Do not prevent the default behavior for arrow keys
    if (colKey === "col4" && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      e.preventDefault(); // Prevent default to handle dropdown ourselves
      const select = e.target;
      if (e.key === "ArrowDown") {
        select.selectedIndex =
          (select.selectedIndex + 1) % select.options.length;
      } else {
        select.selectedIndex =
          (select.selectedIndex - 1 + select.options.length) %
          select.options.length;
      }
      handleCellChange(rowIdx, "col4", select.value);
    }
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
            onBlur={() => handleCellBlur(rowIdx, "col1")}
            onKeyDown={(e) => handleKeyDown(e, rowIdx, "col1")}
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
            onBlur={() => handleCellBlur(rowIdx, "col2")}
            onKeyDown={(e) => handleKeyDown(e, rowIdx, "col2")}
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
            onBlur={() => handleCellBlur(rowIdx, "col3")}
            onKeyDown={(e) => handleKeyDown(e, rowIdx, "col3")}
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
            onBlur={() => handleCellBlur(rowIdx, "col4")}
            onKeyDown={(e) => handleKeyDown(e, rowIdx, "col4")}
            autoFocus // Re-add autoFocus
            onClick={(e) => e.stopPropagation()} // Stop propagation to prevent blur issues
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
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <table
        style={{
          border: "1px solid black",
          width: "80%",
          tableLayout: "fixed",
          backgroundColor: "#f5f5f5",
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
                    width: "25%",
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
                e.currentTarget.style.backgroundColor = "#e0e0e0";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "";
              }}
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  style={{
                    padding: "10px",
                    border: "1px solid black",
                    width: "25%",
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
