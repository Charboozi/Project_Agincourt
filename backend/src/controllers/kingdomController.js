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

module.exports = {  
    getKingdom
};
