const castleModel = require('../models/castleModel');
const kingdomModel = require('../models/kingdomModel');

const createCastle = async (req, res) => {
    const userId = req.user.id;
    const { name } = req.body;

    try {
        const kingdom = await kingdomModel.getKingdomByUserId(userId);
        if (!kingdom) {
            return res.status(403).json({ error: 'You do not own this kingdom' });
        }

        const castle = await castleModel.createCastle(userId, name);

        res.status(201).json({ message: 'Castle created successfully', castle });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getCastles = async (req, res) => {
    const userId = req.user.id; 

    try {
        // Verify the kingdom belongs to the user
        const kingdom = await kingdomModel.getKingdomByUserId(userId);
        if (!kingdom) {
            return res.status(403).json({ error: 'You do not own this kingdom' });
        }

        // Get all castles for the kingdom
        const castles = await castleModel.getAllCastlesByUserId(userId);

        res.status(200).json({ message: 'Castles retrieved successfully', castles });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//Used whenever resources needs to be updated for a castle (FOR TESTING)
const updateCastleResources = async (req, res) => {
    const userId = req.user.id;
    const { castleId, gold = 0, material = 0, food = 0 } = req.body;

    try {
        const castle = await castleModel.getCastleByIdAndUser(castleId, userId);
        if (!castle) {
            return res.status(403).json({ error: 'You do not own this castle' });
        }

        const updatedCastle = await castleModel.updateCastleResources(castleId, gold, material, food);

        res.json({ message: 'Resources updated successfully', castle: updatedCastle });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const buyBuilding = async (req, res) => {
    const userId = req.user.id;
    const { castleId, buildingType, count = 1 } = req.body;

    const buildingCosts = {
        production: { gold: 200 },
        barracks: { gold: 300 },
        farm: { gold: 150 },
    };

    if (!buildingCosts[buildingType]) {
        return res.status(400).json({ error: 'Invalid building type' });
    }

    const { gold } = buildingCosts[buildingType];
    const totalGoldCost = gold * count;

    try {
        const castle = await castleModel.getCastleByIdAndUser(castleId, userId);
        if (!castle) {
            return res.status(404).json({ error: 'Castle not found for this user' });
        }

        if (castle.gold < totalGoldCost) {
            return res.status(400).json({ error: 'Not enough gold to buy this building' });
        }

        const updatedCastle = await castleModel.updateCastleResources(castleId, -totalGoldCost, 0, 0);

        const updatedBuildings = await castleModel.updateBuildingCount(castleId, buildingType, count);

        res.status(200).json({
            message: 'Building purchased successfully',
            updatedCastle,
            updatedBuildings,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



module.exports = {
    createCastle,
    getCastles,
    updateCastleResources,
    buyBuilding
};