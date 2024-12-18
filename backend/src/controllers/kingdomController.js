const kingdomModel = require('../models/kingdomModel');

const getKingdom = async (req, res) => {
    const userId = req.user.id;

    try {
        const kingdom = await kingdomModel.getKingdomByUserId(userId);
        if (!kingdom) {
            return res.status(404).json({ error: 'No kingdom found for this user' });
        }

        res.json(kingdom);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateKingdomResources = async (req, res) => {
    const userId = req.user.id;
    const { kingdomId, gold = 0} = req.body;

    try {
        const kingdom = await kingdomModel.getKingdomByUserId(userId);
        if (!kingdom) {
            return res.status(403).json({ error: 'You do not own this kingdom' });
        }

        const updatedKingdom = await kingdomModel.updateKingdomResources(kingdomId, gold);

        res.json({ message: 'Kingdom Resources updated successfully', kingdom: updatedKingdom });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {  
    getKingdom,
    updateKingdomResources
};
