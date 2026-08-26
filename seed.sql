-- ── Drop tables if they exist ─────────────────────────────────
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS permits;
DROP TABLE IF EXISTS farmers;

-- ── Farmers ───────────────────────────────────────────────────
CREATE TABLE farmers (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    name           TEXT,
    location_name  TEXT,
    location_lat   REAL,
    location_long  REAL,
    acreage        REAL
);

-- ── Permits ───────────────────────────────────────────────────
CREATE TABLE permits (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    farmer_id        INTEGER REFERENCES farmers(id),
    permit_number    TEXT UNIQUE,
    tonnage_capacity REAL,
    status           TEXT DEFAULT 'pending',
    expiry_date      TEXT
);

-- ── Bookings ──────────────────────────────────────────────────
CREATE TABLE bookings (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    permit_id       INTEGER REFERENCES permits(id),
    pickup_time     TEXT,
    truck_id        TEXT,
    delivery_status TEXT
);

-- ── Seed Farmers ──────────────────────────────────────────────
INSERT INTO farmers (name, location_name, location_lat, location_long, acreage) VALUES
('John Omondi',  'Kisumu, Kenya',         -1.286389, 36.817223, 15.5),
('Sarah Kwena',  'Mumias, Kakamega',      -1.2921,   36.8219,   42.0),
('Musa Otieno',  'Chemelil, Kisumu',      -1.3000,   36.7800,    8.2),
('Elena Wanjiku','Muhoroni, Kisumu',      -1.2500,   36.7000,   25.0),
('David Ruto',   'Nandi Hills, Nandi',    -1.3100,   36.9000,   55.3);

-- ── Seed Permits ──────────────────────────────────────────────
INSERT INTO permits (farmer_id, permit_number, tonnage_capacity, status, expiry_date) VALUES
(1, 'PERM-001', 50.0,  'approved', '2026-12-31'),
(2, 'PERM-002', 120.0, 'approved', '2026-06-15'),
(3, 'PERM-003', 25.0,  'expired',  '2025-12-01'),
(4, 'PERM-004', 80.0,  'pending',  '2026-11-20'),
(5, 'PERM-005', 150.0, 'approved', '2026-01-25');

-- ── Seed Bookings ─────────────────────────────────────────────
INSERT INTO bookings (permit_id, pickup_time, truck_id, delivery_status) VALUES
(1, '2026-01-10 08:00:00', 'TRK-99', 'delivered'),
(2, '2026-01-12 10:30:00', 'TRK-42', 'delivered'),
(5, '2026-01-18 07:00:00', 'TRK-10', 'scheduled');
