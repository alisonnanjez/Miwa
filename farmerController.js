const db = require('../config/db');

// ── GET /api/v1/farmers ───────────────────────────────────────
const getAllFarmers = (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT f.*,
        SUM(CASE WHEN p.status = 'approved' AND p.expiry_date > date('now') THEN 1 ELSE 0 END) AS active_permits
      FROM farmers f
      LEFT JOIN permits p ON p.farmer_id = f.id
      GROUP BY f.id
      ORDER BY f.name ASC
    `).all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── POST /api/v1/farmers/register ────────────────────────────
const registerFarmer = (req, res) => {
  const { name, location_name, location_lat, location_long, acreage } = req.body;

  if (!name || !acreage) {
    return res.status(400).json({ error: 'Name and acreage are required.' });
  }

  try {
    const existing = db.prepare('SELECT id FROM farmers WHERE LOWER(name) = LOWER(?)').get(name);
    if (existing) {
      return res.status(400).json({ error: `A farmer named "${name}" already exists.` });
    }

    const result = db.prepare(`
      INSERT INTO farmers (name, location_name, location_lat, location_long, acreage)
      VALUES (?, ?, ?, ?, ?)
    `).run(name, location_name || null, location_lat || null, location_long || null, acreage);

    const newFarmer = db.prepare('SELECT * FROM farmers WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json({
      message: `Farmer "${name}" registered successfully.`,
      farmer: newFarmer,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllFarmers, registerFarmer };
