const express = require('express');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(express.json()); 

// Mount routes
app.use('/auth', authRoutes);

// Root route for testing
app.get('/', (req, res) => {
    res.send('Welcome to the Project Agincourt API!');
});

module.exports = app;