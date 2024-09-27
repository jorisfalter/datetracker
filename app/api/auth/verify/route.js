import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { Database } from "@sqlitecloud/drivers";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    // Database interaction
    const database = new Database(process.env.SQLITECLOUD_URL);
    await database.sql`USE DATABASE chinook.sqlite;`;
    const userData =
      await database.sql`SELECT * FROM entries WHERE email = ${email};`;

    return NextResponse.json({ data: userData });
  } catch (error) {
    console.error("Error verifying token or fetching data:", error);
    return NextResponse.json({
      error: "Failed to fetch data or invalid token",
    });
  }
}
