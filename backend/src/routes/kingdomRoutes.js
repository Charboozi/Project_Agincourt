const express = require('express');
const {  
    getKingdom,
    updateKingdomResources 
} = require('../controllers/kingdomController');

const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authenticateToken, getKingdom);
router.post('/resources', authenticateToken, updateKingdomResources);

module.exports = router;