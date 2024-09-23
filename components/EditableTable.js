"use client";

import { useState } from "react";

// i think this is archived

export default function EditableTable() {
  // Initialize a 3x3 table with default empty values
  const [tableData, setTableData] = useState([
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ]);

  // Track which cell is being edited
  const [editingCell, setEditingCell] = useState({ row: null, col: null });

  // Handle the change of the cell value and save it
  const handleCellChange = (rowIndex, colIndex, value) => {
    const newData = [...tableData];
    newData[rowIndex][colIndex] = value;
    setTableData(newData);
  };

  // Render either the cell's value or an input field if the cell is being edited
  const renderCell = (cell, rowIndex, colIndex) => {
    if (editingCell.row === rowIndex && editingCell.col === colIndex) {
      return (
        <input
          type="text"
          value={cell}
          onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
          onBlur={() => setEditingCell({ row: null, col: null })} // Stop editing when the user clicks outside the input
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setEditingCell({ row: null, col: null }); // Stop editing on Enter key press
            }
          }}
          autoFocus
        />
      );
    }
    return cell || "Click to edit"; // Display a placeholder if the cell is empty
  };

  return (
    <table border="1" style={{ borderCollapse: "collapse", width: "300px" }}>
      <tbody>
        {tableData.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, colIndex) => (
              <td
                key={colIndex}
                style={{
                  padding: "8px",
                  textAlign: "center",
                  cursor: "pointer",
                }}
                onClick={() => setEditingCell({ row: rowIndex, col: colIndex })} // Enable editing on click
              >
                {renderCell(cell, rowIndex, colIndex)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
