const userModel = require('../models/userModel');
const allianceModel = require('../models/allianceModel');

const createAlliance = async (req, res) => {
    const userId = req.user.id;
    const { allyUserId } = req.body; // ID of the ally kingdom

    try {

        const allyUserResult = await userModel.getUserById(allyUserId);
        if (!allyUserResult) {
            return res.status(404).json({ error: 'Userser not found' });
        }

        const existingAllianceResult = await allianceModel.getAllianceById(userId, allyUserId);
        if (existingAllianceResult) {
            return res.status(400).json({ error: 'Alliance already exists' });
        }

        const allianceResult = await allianceModel.createAlliance(userId, allyUserId);

        res.status(201).json({
            message: 'Alliance created successfully',
            alliance: allianceResult.rows[0],
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllAllies = async (req, res) => {
    const userId = req.user.id;

    try {

        const alliesResult = await allianceModel.getAllAlliesById(userId);

        res.json({
            message: 'Allies fetched successfully',
            allies: alliesResult,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const breakAlliance = async (req, res) => {
    const userId = req.user.id;
    const { allyUserId } = req.body;

    try {
        allianceResult = await allianceModel.getAllyById(userId, allyUserId);
        if (!allianceResult) {
            return res.status(404).json({ error: 'Alliance not found' });
        }

        await allianceModel.breakAlliance(userId, allyUserId);

        res.json({ message: 'Alliance broken successfully', });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createAlliance,
    getAllAllies,
    breakAlliance
}
