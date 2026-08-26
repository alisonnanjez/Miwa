const express = require('express');
const router  = express.Router();
const transportController = require('../controllers/transportController');

// GET /api/v1/transport/optimize → nearest-neighbor route for pending bookings
router.get('/optimize', transportController.optimizeRoute);

module.exports = router;
