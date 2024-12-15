const express = require('express');
const { 
    createKingdom, 
    getKingdom, 
    updateResources,
    buyBuilding 
} = require('../controllers/kingdomController');

const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/create', authenticateToken, createKingdom);
router.get('/', authenticateToken, getKingdom);
router.post('/resources', authenticateToken, updateResources);
router.post('/buildings/buy', authenticateToken, buyBuilding);

module.exports = router;
