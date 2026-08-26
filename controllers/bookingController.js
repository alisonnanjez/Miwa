const db = require('../config/db');

// ── GET /api/v1/bookings ──────────────────────────────────────
const getAllBookings = (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT
        b.id,
        b.truck_id,
        b.pickup_time,
        b.delivery_status,
        p.permit_number,
        p.tonnage_capacity,
        f.name AS farmer_name
      FROM bookings b
      JOIN permits  p ON p.id = b.permit_id
      JOIN farmers  f ON f.id = p.farmer_id
      ORDER BY b.pickup_time DESC
    `).all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── POST /api/v1/bookings/create ─────────────────────────────
const createBooking = (req, res) => {
  const { permit_id, pickup_time, truck_id } = req.body;

  if (!permit_id || !pickup_time || !truck_id) {
    return res.status(400).json({ error: 'permit_id, pickup_time and truck_id are all required.' });
  }

  try {
    // Check permit exists and is approved
    const permit = db.prepare(`
      SELECT * FROM permits WHERE id = ? AND status = 'approved' AND expiry_date > date('now')
    `).get(permit_id);

    if (!permit) {
      return res.status(400).json({ error: 'Permit not found or is not active.' });
    }

    // Check permit doesn't already have a scheduled/in-transit booking
    const existing = db.prepare(`
      SELECT id FROM bookings
      WHERE permit_id = ? AND delivery_status IN ('scheduled', 'in-transit')
    `).get(permit_id);

    if (existing) {
      return res.status(400).json({ error: 'This permit already has an active booking.' });
    }

    const result = db.prepare(`
      INSERT INTO bookings (permit_id, pickup_time, truck_id, delivery_status)
      VALUES (?, ?, ?, 'scheduled')
    `).run(permit_id, pickup_time, truck_id);

    const newBooking = db.prepare(`
      SELECT b.*, p.permit_number, f.name AS farmer_name
      FROM bookings b
      JOIN permits p ON p.id = b.permit_id
      JOIN farmers f ON f.id = p.farmer_id
      WHERE b.id = ?
    `).get(result.lastInsertRowid);

    res.status(201).json({
      message: 'Booking created successfully.',
      booking: newBooking,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── PATCH /api/v1/bookings/:id/status ────────────────────────
const updateStatus = (req, res) => {
  const { id } = req.params;
  const { delivery_status } = req.body;

  const allowed = ['scheduled', 'in-transit', 'delivered'];
  if (!allowed.includes(delivery_status)) {
    return res.status(400).json({ error: `Status must be one of: ${allowed.join(', ')}` });
  }

  try {
    const booking = db.prepare('SELECT id FROM bookings WHERE id = ?').get(id);
    if (!booking) return res.status(404).json({ error: 'Booking not found.' });

    db.prepare('UPDATE bookings SET delivery_status = ? WHERE id = ?').run(delivery_status, id);

    const updated = db.prepare(`
      SELECT b.*, p.permit_number, f.name AS farmer_name
      FROM bookings b
      JOIN permits p ON p.id = b.permit_id
      JOIN farmers f ON f.id = p.farmer_id
      WHERE b.id = ?
    `).get(id);

    res.json({ message: 'Booking status updated.', booking: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllBookings, createBooking, updateStatus };
