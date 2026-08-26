const express = require('express');
const router  = express.Router();
const permitController = require('../controllers/permitController');

// GET  /api/v1/permits/approved  → list of approved, non-expired permits
router.get('/approved', permitController.getApproved);

// POST /api/v1/permits/apply     → apply for a permit (eligibility check)
router.post('/apply', permitController.applyForPermit);

module.exports = router;
