const express = require('express');
const { 
    createCastle, 
    getCastles, 
    updateCastleResources,
    buyBuilding 
} = require('../controllers/castleController.js');

const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authenticateToken, getCastles);
router.post('/create', authenticateToken, createCastle);
router.post('/resources', authenticateToken, updateCastleResources);
router.post('/buildings/buy', authenticateToken, buyBuilding);

module.exports = router;
