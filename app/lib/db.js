import Database from "better-sqlite3";
import path from "path";

// Initialize the database
const db = new Database(path.resolve("database.sqlite"));

// Create the table if it doesn't exist
export function initializeDB() {
  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT
    )
  `
  ).run();
}

// Get all entries
export function getEntries() {
  return db.prepare("SELECT * FROM entries").all();
}

// Add a new entry
export function addEntry(content) {
  return db.prepare("INSERT INTO entries (content) VALUES (?)").run(content);
}
