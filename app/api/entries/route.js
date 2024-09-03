import { NextResponse } from "next/server";
import { initializeDB, getEntries, addEntry } from "../../lib/db";

export async function GET() {
  initializeDB();
  const entries = getEntries();
  return NextResponse.json(entries);
}

export async function POST(request) {
  const { content } = await request.json();
  addEntry(content);
  return NextResponse.json({ message: "Entry added" }, { status: 201 });
}
