const express = require('express');
const {  
    createArmy,
    getArmies,
    moveArmy,
    splitArmy
} = require('../controllers/armyController');

const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/create', authenticateToken, createArmy);
router.get('/', authenticateToken, getArmies);
router.post('/move', authenticateToken, moveArmy);
router.post('/split', authenticateToken, splitArmy);

module.exports = router;