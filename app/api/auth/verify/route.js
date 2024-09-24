import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { Database } from "@sqlitecloud/drivers";

// The handler for GET requests
export async function GET(req) {
  const { searchParams } = new URL(req.url); // Extract search parameters from the URL
  const token = searchParams.get("token"); // Get the JWT token from the query string

  try {
    // Verify the JWT token using the secret key from the environment
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email; // Extract the email from the decoded token

    console.log(`Verified token for email: ${email}`);

    // Initialize connection to SQLiteCloud
    const database = new Database(process.env.SQLITECLOUD_URL);

    // // Use the correct database (without .sqlite extension)
    // await database.execute("USE DATABASE chinook"); // Use 'chinook' or the name of your DB

    // // Fetch user data using a valid query
    // const query = `SELECT * FROM entries WHERE email = ?`;
    // const userData = await database.execute(query, [email]); // Pass the email as a parameter

    // Fetch user data from the entries table where email matches the one from the token
    // Switch to the correct database > can't put comments behind sql code
    // Query the data
    const userData = await database.sql`
      USE DATABASE chinook.sqlite;  
      SELECT * FROM entries WHERE email = ${email};  
    `;

    console.log("Fetched user data:", JSON.stringify(userData, null, 2));

    // Return the fetched user data as JSON
    return NextResponse.json({ data: userData });
  } catch (error) {
    console.error("Error verifying token or fetching data:", error);

    // Return an error response if token verification or database fetching fails
    return NextResponse.json(
      { message: "Failed to fetch data", error },
      { status: 500 }
    );
  }
}
