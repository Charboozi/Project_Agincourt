//Check if user has valid JWT key
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1]; // Extract token after "Bearer"

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET); // Verify token
        req.user = user; // Attach the user info to the request object
        next(); // Proceed to the next middleware/route handler
    } catch (error) {
        res.status(403).json({ error: 'Invalid or expired token' });
    }
};

module.exports = authenticateToken;
