const db = require('../config/db');

// ── GET /api/v1/permits/approved ──────────────────────────────
const getApproved = (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT
        p.id,
        p.permit_number,
        p.tonnage_capacity,
        p.status,
        p.expiry_date,
        f.name    AS farmer_name,
        f.acreage AS farm_acreage
      FROM permits p
      JOIN farmers f ON f.id = p.farmer_id
      WHERE p.status = 'approved'
        AND p.expiry_date > date('now')
      ORDER BY p.expiry_date ASC
    `).all();

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── POST /api/v1/permits/apply ────────────────────────────────
const applyForPermit = (req, res) => {
  const { farmer_id, tonnage_capacity, expiry_date } = req.body;

  try {
    // 1. Check farmer exists
    const farmer = db.prepare('SELECT * FROM farmers WHERE id = ?').get(farmer_id);
    if (!farmer) return res.status(404).json({ error: 'Farmer not found.' });

    // 2. Eligibility check — must have at least 5 acres
    if (farmer.acreage < 5) {
      return res.status(400).json({
        error: `Ineligible: ${farmer.name} only has ${farmer.acreage} acres. Minimum is 5.`,
      });
    }

    // 3. Check no existing active permit
    const existing = db.prepare(`
      SELECT id FROM permits
      WHERE farmer_id = ?
        AND status = 'approved'
        AND expiry_date > date('now')
    `).get(farmer_id);

    if (existing) {
      return res.status(400).json({ error: `${farmer.name} already has an active permit.` });
    }

    // 4. Insert new permit
    const permitNumber = `PERM-${Date.now()}`;
    const result = db.prepare(`
      INSERT INTO permits (farmer_id, permit_number, tonnage_capacity, status, expiry_date)
      VALUES (?, ?, ?, 'pending', ?)
    `).run(farmer_id, permitNumber, tonnage_capacity, expiry_date);

    const newPermit = db.prepare('SELECT * FROM permits WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json({ message: 'Permit application submitted successfully.', permit: newPermit });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getApproved, applyForPermit };
