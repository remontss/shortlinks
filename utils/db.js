import Database from 'better-sqlite3';

let db;

export async function getDB() {
  if (!db) {
    db = new Database('/tmp/links.db');
  }
  return db;
}
