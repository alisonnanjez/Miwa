const express = require('express');
const path = require('path');

const app = express();

// ── Middleware ────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ── View Engine ───────────────────────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ── API Routes ────────────────────────────────────────────────
const permitRoutes    = require('./routes/permitRoutes');
const transportRoutes = require('./routes/transportRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const farmerRoutes    = require('./routes/farmerRoutes');
const bookingRoutes   = require('./routes/bookingRoutes');

app.use('/api/v1/permits',   permitRoutes);
app.use('/api/v1/transport', transportRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/farmers',   farmerRoutes);
app.use('/api/v1/bookings',  bookingRoutes);

// ── UI Routes ─────────────────────────────────────────────────
app.get('/',          (req, res) => res.render('index'));
app.get('/permits',   (req, res) => res.render('permits'));
app.get('/analytics', (req, res) => res.render('analytics'));
app.get('/bookings',   (req, res) => res.render('bookings'));
app.get('/transport',  (req, res) => res.render('transport'));

// ── Start ─────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Miwa server running on http://localhost:${PORT}`);
});
