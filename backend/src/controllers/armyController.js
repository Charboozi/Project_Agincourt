const castleModel = require('../models/castleModel');
const armyModel = require('../models/armyModel');

const createArmy = async (req, res) => {
    const userId = req.user.id;
    const { castleId, cavalry = 0, infantry = 0, archers = 0 } = req.body;

    try {
        const castle = await castleModel.getCastleByIdAndUser(castleId, userId);
        if (!castle) {
            return res.status(403).json({ error: 'You do not own this castle' });
        }

        const army = await armyModel.createArmy(userId, castleId, cavalry, infantry, archers, castle.x, castle.y);

        res.status(201).json({ message: 'Army created successfully', army });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getArmies = async (req, res) => {
    const userId = req.user.id;
    try {
        const armies = await armyModel.getAllArmies(userId);
        if (!armies) {
            return res.status(404).json({ error: 'Armies not found' });
        }

        res.json({message: 'Armies retrieved succesfully', armies});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const moveArmy = async (req, res) => {
    const userId = req.user.id;
    const { armyId, x, y } = req.body;

    try {
        const army = await armyModel.getArmyById(armyId, userId);
        if (!army) {
            return res.status(403).json({ error: 'You do not own this army' });
        }

        // Check if another army exists at the target coordinates for the same user
        const existingArmy = await armyModel.MergeArmiesCheck(x, y, userId, armyId);

        if (existingArmy) {
            // Merge the armies
            const updatedArmy = await armyModel.updateArmyTroops(
                existingArmy.id,
                army.cavalry,
                army.infantry,
                army.archers
            );

            // Delete the army being moved
            await armyModel.deleteArmy(armyId);

            return res.json({
                message: 'Armies merged successfully',
                army: updatedArmy,
            });
        }

        const targetCastle = await castleModel.getCastleByLocation(x, y);
        const targetCastleId = targetCastle ? targetCastle.id : null;

        // If no army exists at the target position, simply move the army
        const movedArmy = await armyModel.moveArmy(armyId, x, y, targetCastleId);

        res.json({
            message: 'Army moved successfully',
            army: movedArmy,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const splitArmy = async (req, res) => {
    const userId = req.user.id;
    const { armyId, cavalry = 0, infantry = 0, archers = 0 } = req.body;

    try {
        const army = await armyModel.getArmyById(armyId, userId);
        if (!army) {
            return res.status(403).json({ error: 'You do not own this army' });
        }

        if (army.cavalry < cavalry || army.infantry < infantry || army.archers < archers) {
            return res.status(400).json({ error: 'Not enough troops to split' });
        }

        // Deduct the troops from the original army
        const updatedArmy = await armyModel.updateArmyTroops(armyId, -cavalry, -infantry, -archers);

        // Find an available adjacent location
        const directions = [
            { dx: 1, dy: 0 }, 
            { dx: -1, dy: 0 }, 
            { dx: 0, dy: 1 },  
            { dx: 0, dy: -1 }, 
        ];

        let newX, newY;
        for (const { dx, dy } of directions) {
            const testX = army.x + dx;
            const testY = army.y + dy;

            const collision = await armyModel.CheckLocationForArmy(testX, testY);

            if (!collision) {
                newX = testX;
                newY = testY;
                break;
            }
        }

        if (newX === undefined || newY === undefined) {
            return res.status(400).json({ error: 'No available position to place the split army' });
        }

        const newArmy = await armyModel.createArmy(userId, null, cavalry, infantry, archers, newX, newY);

        res.status(201).json({
            message: 'Army split successfully',
            originalArmy: updatedArmy,
            newArmy,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    createArmy,
    getArmies,
    moveArmy,
    splitArmy
}
