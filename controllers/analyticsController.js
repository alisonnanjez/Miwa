const db = require('../config/db');

// ── GET /api/v1/analytics/dashboard ──────────────────────────
const getDashboard = (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT
        f.name                                                        AS farmer_name,
        f.acreage,
        SUM(p.tonnage_capacity)                                       AS total_quota_tonnes,
        COUNT(b.id)                                                   AS total_deliveries,
        SUM(CASE WHEN b.delivery_status = 'delivered' THEN 1 ELSE 0 END) AS completed_deliveries
      FROM farmers f
      LEFT JOIN permits  p ON p.farmer_id = f.id
      LEFT JOIN bookings b ON b.permit_id = p.id
      GROUP BY f.id, f.name, f.acreage
      ORDER BY total_quota_tonnes DESC
    `).all();

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── GET /api/v1/analytics/efficiency ─────────────────────────
// Days from permit issue (expiry - 1 year proxy) to pickup
const getEfficiency = (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT
        f.name            AS farmer_name,
        p.permit_number,
        p.expiry_date,
        b.pickup_time,
        b.delivery_status,
        CAST(
          (julianday(b.pickup_time) - julianday(date(p.expiry_date, '-1 year')))
        AS INTEGER)       AS days_to_pickup
      FROM bookings b
      JOIN permits  p ON p.id = b.permit_id
      JOIN farmers  f ON f.id = p.farmer_id
      WHERE b.delivery_status = 'delivered'
      ORDER BY days_to_pickup ASC
    `).all();

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getDashboard, getEfficiency };
