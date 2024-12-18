const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, findUserByUsername } = require('../models/userModel.js');
const { createKingdom } = require('../models/kingdomModel');
const { createCastle } = require('../models/castleModel');

const registerUser = async (req, res) => {
    const { username, password ,x ,y } = req.body;

    if (!username || !password || x === undefined || y === undefined) {
        return res.status(400).json({
            error: 'Username, password, x, and y are required fields.'
        });
    }
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await createUser(username, hashedPassword);
        
        // Create a default kingdom and castle for the user
        const defaultKingdomName = `${username}'s Kingdom`;
        const newKingdom = await createKingdom(newUser.id, defaultKingdomName);
        const newCastle = await createCastle(newUser.id, `${username}'s Main Castle`, x, y);
        
        res.status(201).json({
            message: 'User registered successfully',
            user: newUser,
            kingdom: newKingdom,
            castle: newCastle
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await findUserByUsername(username);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ error: 'Invalid credentials' });

        // Skapa JWT-token
        const token = jwt.sign(
            { id: user.id, username: user.username }, // Payload
            process.env.JWT_SECRET,                  // Hemlig nyckel
            { expiresIn: '1d' }                      // Token giltig tid
        );

        res.json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
};
