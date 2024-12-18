const express = require('express');
const {  
    createAlliance,
    getAllAllies,
    breakAlliance
} = require('../controllers/allianceController');

const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/create', authenticateToken, createAlliance);
router.get('/', authenticateToken, getAllAllies);
router.delete('/', authenticateToken, breakAlliance)

module.exports = router;