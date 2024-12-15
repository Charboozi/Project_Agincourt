const pool = require('../config/db');

const createKingdom = async (req, res) => {
    console.log(req.body);
    const userId = req.user.id; // User ID from JWT
    const { name } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO kingdoms (user_id, name) VALUES ($1, $2) RETURNING *',
            [userId, name]
        );

        res.status(201).json({ message: 'Kingdom created successfully', kingdom: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getKingdom = async (req, res) => {
    const userId = req.user.id;

    try {
        const result = await pool.query('SELECT * FROM kingdoms WHERE user_id = $1', [userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'No kingdom found for this user' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//Used whenever resources needs to be updated (FOR TESTING)
const updateResources = async (req, res) => {
    const userId = req.user.id; // Get user ID from JWT
    const { gold = 0, material = 0, food = 0 } = req.body;

    try {
        const result = await pool.query(
            `UPDATE kingdoms
             SET gold = gold + $1,
                 material = material + $2,
                 food = food + $3
             WHERE user_id = $4
             RETURNING *`,
            [gold, material, food, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Kingdom not found for this user' });
        }

        res.json({ message: 'Resources updated successfully', kingdom: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const buyBuilding = async (req, res) => {
    const userId = req.user.id; // Get user ID from JWT
    const { buildingType, count = 1 } = req.body; // Type of building and quantity

    const buildingCosts = {
        production: { gold: 200},
        barracks: { gold: 300 },
        farm: { gold: 150},
    };

    // Validate building type
    if (!buildingCosts[buildingType]) {
        return res.status(400).json({ error: 'Invalid building type' });
    }

    const { gold } = buildingCosts[buildingType];
    const totalGoldCost = gold * count;

    try {
        // Get the kingdom
        const kingdomResult = await pool.query('SELECT * FROM kingdoms WHERE user_id = $1', [userId]);
        if (kingdomResult.rows.length === 0) {
            return res.status(404).json({ error: 'Kingdom not found for this user' });
        }
        const kingdom = kingdomResult.rows[0];

        // Check if the kingdom has enough resources
        if (kingdom.gold < totalGoldCost) {
            return res.status(400).json({ error: 'Not enough gold to buy this building' });
        }

        // Deduct resources from the kingdom
        await pool.query(
            `UPDATE kingdoms
             SET gold = gold - $1
             WHERE id = $2`,
            [totalGoldCost, kingdom.id]
        );

        // Update the building count
        const result = await pool.query(
            `INSERT INTO buildings (kingdom_id, ${buildingType})
             VALUES ($1, $2)
             ON CONFLICT (kingdom_id)
             DO UPDATE SET ${buildingType} = buildings.${buildingType} + $2
             RETURNING *`,
            [kingdom.id, count]
        );

        res.json({ message: 'Building purchased successfully', buildings: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { 
    createKingdom, 
    getKingdom, 
    updateResources,
    buyBuilding 
};
