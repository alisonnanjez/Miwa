const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'miwa.db');
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
