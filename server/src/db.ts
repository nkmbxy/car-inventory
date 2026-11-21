import Database from "better-sqlite3";

export const db = new Database("cars.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS cars (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    plate      TEXT NOT NULL,
    province   TEXT NOT NULL DEFAULT '',
    brand      TEXT NOT NULL,
    model      TEXT NOT NULL,
    year       TEXT NOT NULL DEFAULT '',
    color      TEXT NOT NULL DEFAULT '',
    note       TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (plate, province)
  )
`);