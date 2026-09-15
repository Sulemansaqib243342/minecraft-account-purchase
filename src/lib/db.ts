import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';

// Vercel serverless environment has a read-only filesystem except /tmp
const isVercel = Boolean(process.env.VERCEL);
const dataDir = isVercel ? '/tmp' : path.join(process.cwd(), 'data');

if (!isVercel && !fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'database.db');
const db = new Database(dbPath);

// Enable WAL mode on local, or MEMORY/DELETE mode on Vercel serverless /tmp
if (isVercel) {
  db.pragma('journal_mode = MEMORY');
} else {
  db.pragma('journal_mode = WAL');
}

// Initialize database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS inquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    product TEXT,
    status TEXT DEFAULT 'new',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS replies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    inquiry_id INTEGER NOT NULL,
    message TEXT NOT NULL,
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (inquiry_id) REFERENCES inquiries(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
  CREATE INDEX IF NOT EXISTS idx_inquiries_email ON inquiries(email);
  CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries(created_at);
`);

// Admin credentials (hashed with bcrypt 12 rounds)
const adminUsername = process.env.ADMIN_USERNAME || 'nothaseeb12@gmail.com';
const adminPassword = process.env.ADMIN_PASSWORD || 'TWhaseeb1826@#1';

const salt = bcrypt.genSaltSync(12);
const hash = bcrypt.hashSync(adminPassword, salt);

// Clean up old usernames if updated
db.prepare('DELETE FROM admins WHERE username != ?').run(adminUsername);

// Upsert admin user safely using parameterized queries
const checkAdmin = db.prepare('SELECT id FROM admins WHERE username = ?');
const existingAdmin = checkAdmin.get(adminUsername);

if (existingAdmin) {
  const updateAdmin = db.prepare('UPDATE admins SET password_hash = ? WHERE username = ?');
  updateAdmin.run(hash, adminUsername);
} else {
  const insertAdmin = db.prepare('INSERT OR IGNORE INTO admins (username, password_hash) VALUES (?, ?)');
  insertAdmin.run(adminUsername, hash);
}

export default db;
