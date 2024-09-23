// app/api/auth/verify.js

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { Database } from "@sqlitecloud/drivers";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  try {
    // Verify the JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    // Initialize connection to SQLiteCloud
    const database = new Database(process.env.SQLITECLOUD_URL);

    // Fetch user data
    const userData = await database.sql`
      USE DATABASE chinook.sqlite;
      SELECT * FROM entries WHERE email = ${email};
    `;

    return NextResponse.json({ data: userData });
  } catch (error) {
    console.error("Error verifying token or fetching data:", error);
    return NextResponse.json({ message: "Failed to fetch data", error });
  }
}
