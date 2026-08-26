const express = require('express');
const router  = express.Router();
const farmerController = require('../controllers/farmerController');

// POST /api/v1/farmers/register → register a new farmer
router.post('/register', farmerController.registerFarmer);

// GET /api/v1/farmers → list all farmers (for the booking form dropdown)
router.get('/', farmerController.getAllFarmers);

module.exports = router;
