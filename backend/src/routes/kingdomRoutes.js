const express = require('express');
const {  
    getKingdom, 
} = require('../controllers/kingdomController');

const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authenticateToken, getKingdom);


module.exports = router;
