const express = require('express');

const authRoutes = require('./routes/authRoutes');
const kingdomRoutes = require('./routes/kingdomRoutes');
const castleRoutes = require('./routes/castleRoutes');
const mapRoutes = require('./routes/mapRoutes');
const armyRoutes = require('./routes/armyRoutes');
const allianceRoutes = require('./routes/allianceRoutes');

const app = express();

app.use(express.json()); 

// Mount routes
app.use('/auth', authRoutes);
app.use('/kingdom', kingdomRoutes);
app.use('/castle', castleRoutes);
app.use('/map', mapRoutes);
app.use('/army', armyRoutes);
app.use('/alliance', allianceRoutes);

// Root route for testing
app.get('/', (req, res) => {
    res.send('Welcome to the Project Agincourt API!');
});

module.exports = app;