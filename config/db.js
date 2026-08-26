const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// On Render, use /var/data for persistent disk storage.
// Locally, use the project root.
const dbDir  = process.env.RENDER ? '/var/data' : path.join(__dirname, '..');
const dbPath = path.join(dbDir, 'miwa.db');

// Make sure the directory exists
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

module.exports = db;
