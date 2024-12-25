const express = require('express');
const {  
    joinAlliance,
    getAllies,
    leaveAlliance
} = require('../controllers/allianceController');

const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/join', authenticateToken, joinAlliance);
router.get('/', authenticateToken, getAllies);
router.delete('/', authenticateToken, leaveAlliance)

module.exports = router;