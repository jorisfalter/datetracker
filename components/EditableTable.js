"use client"; // Add this line to specify that this is a Client Component

import { useState } from "react";

export default function EditableTable() {
  // Initialize a 3x3 table with empty values
  const [tableData, setTableData] = useState([
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ]);

  // Handle cell value change
  const handleCellChange = (rowIndex, colIndex, value) => {
    const newData = [...tableData];
    newData[rowIndex][colIndex] = value;
    setTableData(newData);
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
                onClick={(e) => {
                  const input = prompt("Enter new value:", cell);
                  if (input !== null) {
                    handleCellChange(rowIndex, colIndex, input);
                  }
                }}
              >
                {cell || "Click to edit"}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
