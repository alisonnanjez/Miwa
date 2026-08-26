const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Match the same path logic as config/db.js
const dbDir  = process.env.RENDER ? '/var/data' : path.join(__dirname);
const dbPath = path.join(dbDir, 'miwa.db');

if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

const db = new Database(dbPath);

const sql = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');

const statements = sql
  .split('\n')
  .filter(line => !line.trim().startsWith('--'))
  .join('\n')
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0);

for (const statement of statements) {
  try {
    db.exec(statement);
  } catch (err) {
    console.error('❌ Failed statement:\n', statement);
    console.error('Error:', err.message);
  }
}

console.log('✅ miwa.db seeded successfully!');
db.close();
