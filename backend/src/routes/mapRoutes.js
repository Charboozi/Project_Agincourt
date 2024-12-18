const express = require('express');
const {  
    getMap
} = require('../controllers/mapController');

const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authenticateToken, getMap);

module.exports = router;