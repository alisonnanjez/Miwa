const db = require('../config/db');

// ── Haversine formula ─────────────────────────────────────────
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// ── Nearest Neighbor Algorithm ────────────────────────────────
const nearestNeighbor = (farms) => {
  if (farms.length === 0) return [];
  const visited = new Set();
  const route = [];
  let current = farms[0];
  visited.add(current.farmer_id);
  route.push(current);

  while (visited.size < farms.length) {
    let nearest = null;
    let minDist = Infinity;
    for (const farm of farms) {
      if (visited.has(farm.farmer_id)) continue;
      const dist = haversineDistance(
        current.location_lat, current.location_long,
        farm.location_lat,    farm.location_long
      );
      if (dist < minDist) { minDist = dist; nearest = farm; }
    }
    if (!nearest) break;
    nearest.distance_from_previous_km = minDist.toFixed(2);
    visited.add(nearest.farmer_id);
    route.push(nearest);
    current = nearest;
  }
  return route;
};

// ── GET /api/v1/transport/optimize ───────────────────────────
const optimizeRoute = (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT
        b.id          AS booking_id,
        b.truck_id,
        b.pickup_time,
        p.permit_number,
        p.tonnage_capacity,
        f.id          AS farmer_id,
        f.name        AS farmer_name,
        f.location_lat,
        f.location_long
      FROM bookings b
      JOIN permits p ON p.id = b.permit_id
      JOIN farmers f ON f.id = p.farmer_id
      WHERE b.delivery_status = 'scheduled'
      ORDER BY b.pickup_time ASC
    `).all();

    if (rows.length === 0) {
      return res.json({ message: 'No scheduled bookings to optimize.', route: [] });
    }

    const optimizedRoute = nearestNeighbor(rows);
    res.json({ total_stops: optimizedRoute.length, optimized_route: optimizedRoute });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { optimizeRoute };
