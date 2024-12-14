const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware');


const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

// En skyddad route som kräver en giltig JWT TEST
/*router.get('/profile', authenticateToken, (req, res) => {
    res.json({
        message: 'Welcome to your profile!',
        user: req.user, 
    });
});*/

module.exports = router;
