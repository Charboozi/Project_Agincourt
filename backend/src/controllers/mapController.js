const mapModel = require('../models/mapModel');

const getMap = async (req, res) => { 
    try {
        const castles = await mapModel.getAllCastlesWithUsernames();
        res.status(200).json({ message: 'All Castles on the Map', castles });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {  
    getMap
};
