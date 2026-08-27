const Database = require('better-sqlite3');
const path = require('path');

// Always store miwa.db in the project root
const dbPath = path.join(__dirname, '..', 'miwa.db');

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

module.exports = db;
