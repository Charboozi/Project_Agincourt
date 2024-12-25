const allianceModel = require('../models/allianceModel');
const userModel = require('../models/userModel');

const joinAlliance = async (req, res) => {
    const userId = req.user.id;
    const { liegeId } = req.body;
    try {

        if (liegeId === userId) {
            return res.status(400).json({ error: 'cannot create alliance with yourself' });
        }

        let liegeAlliance = await allianceModel.getUserAlliance(liegeId);
        if (!liegeAlliance) { 
            const user = await userModel.getUserById(liegeId);
            const username = user.username;
            
            const liegeAlliance = await allianceModel.createAlliance(liegeId, `${username}'s Alliance`);
            await allianceModel.joinAlliance(liegeId, liegeAlliance.id, 1);
            
        }
        console.log(liegeAlliance);
        liegeAlliance = await allianceModel.getUserAlliance(liegeId);
        const liege = await allianceModel.getAllianceMember(liegeId)
        const rank = liege.rank + 1;
        await allianceModel.joinAlliance(userId, liegeAlliance.alliance_id, rank);

        res.json({
            message: 'Joined Alliance!',
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to join alliance.',
        });
    }
};

const getAllies = async (req, res) => {
    const userId = req.user.id;

    try {
        const userAllianceResult = await allianceModel.getUserAlliance(userId);

        if (!userAllianceResult) {
            return res.status(404).json({ message: 'User is not part of any alliance.' });
        }

        const allies = await allianceModel.getAllianceMembers(userAllianceResult.alliance_id);
        if (allies.length === 0) {
            return res.json({
                message: 'No allies found in your alliance.',
                allies: [],
            });
        }

        res.json({
            message: 'Allies fetched successfully!',
            allies,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch allies.',
        });
    }
};

const leaveAlliance = async (req, res) => {
    try {
        const userId = req.user.id;

        const userAlliance = await allianceModel.getUserAlliance(userId);
        const leaderCheck = userAlliance.rank;

        if (leaderCheck === 1) {
            await allianceModel.deleteAlliance(userId);
        }

        await allianceModel.leaveAlliance(userId);

        res.json({
            message: 'Left Alliance...',
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to leave alliance. Please try again later.',
        });
    }
};


module.exports = {
    joinAlliance,
    getAllies,
    leaveAlliance
}
