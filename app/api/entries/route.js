// app/api/entries/route.js

import { Database } from "@sqlitecloud/drivers";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { data, email } = await req.json();

  // Initialize connection to SQLiteCloud using environment variables
  const database = new Database(process.env.SQLITECLOUD_URL);

  try {
    console.log("Checking for duplicates and inserting data...");

    // Create an array of SQL queries that check for duplicates and insert if no duplicates are found
    const queries = data.map(async (entry) => {
      // First, check if the entry already exists (based on specific fields, like who, what, dayNum, monthString, and email)
      const existingEntries = await database.sql`
        USE DATABASE chinook.sqlite;
        SELECT * FROM entries 
        WHERE who = ${entry.col1} 
        AND what = ${entry.col2}
        AND dayNum = ${entry.col3}
        AND monthString = ${entry.col4}
        AND email = ${email}
        AND month_day = ${entry.date};
      `;

      // If no duplicates are found, insert the entry
      if (existingEntries.length === 0) {
        console.log(`Inserting new entry for: ${entry.col1}`);
        await database.sql`
          INSERT INTO entries (who, what, dayNum, monthString, email, month_day) 
          VALUES (${entry.col1}, ${entry.col2}, ${entry.col3}, ${entry.col4}, ${email}, ${entry.date});
        `;
      } else {
        console.log(`Duplicate found for: ${entry.col1}, skipping insertion.`);
      }
    });

    // Execute all queries
    await Promise.all(queries);

    // Send a successful response back
    return NextResponse.json({
      message: "Data inserted (without duplicates).",
    });
  } catch (error) {
    console.error("Error inserting data:", error);
    return NextResponse.json({ message: "Failed to insert data", error });
  }
}

export async function DELETE(req) {
  console.log("we're in the delete route!");
  const { who, what, dayNum, monthString, email, month_day } = await req.json();

  // !!!only the email comes through
  console.log([who, what, dayNum, monthString, email]);

  // Initialize connection to SQLiteCloud using environment variables
  const database = new Database(process.env.SQLITECLOUD_URL);

  try {
    console.log("Deleting entry in the entries > route file ...");

    // Execute the deletion query
    const result = await database.sql`
      USE DATABASE chinook.sqlite;
      DELETE FROM entries 
      WHERE who = ${who} 
      AND what = ${what}
      AND dayNum = ${dayNum}
      AND monthString = ${monthString}
      AND email = ${email}
    `;

    // Check if any rows were affected
    if (result.changes > 0) {
      return NextResponse.json({ message: "Entry deleted successfully." });
    } else {
      return NextResponse.json(
        { message: "No entry found to delete." },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error deleting entry:", error);
    return NextResponse.json(
      { message: "Failed to delete entry", error },
      { status: 500 }
    );
  }
}
