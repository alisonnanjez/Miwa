const express = require('express');
const router  = express.Router();
const analyticsController = require('../controllers/analyticsController');

// GET /api/v1/analytics/dashboard   → tonnage moved vs permit quotas
router.get('/dashboard', analyticsController.getDashboard);

// GET /api/v1/analytics/efficiency  → avg time permit-issued to cane-delivered
router.get('/efficiency', analyticsController.getEfficiency);

module.exports = router;
