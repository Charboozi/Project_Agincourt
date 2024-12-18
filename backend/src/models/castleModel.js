const pool = require('../config/db');

const getAllCastlesByUserId = async (userId) => {
    const query = `
        SELECT u.username, c.* 
        FROM users u
        INNER JOIN castles c ON u.id = c.user_id
        WHERE u.id = $1
    `;
    const result = await pool.query(query, [userId]);
    return result.rows; // Returns all rows (castles) for the specified user
};

const createCastle = async (userId, name, x, y) => {
    const query = 'INSERT INTO castles (user_id, name, x, y) VALUES ($1, $2, $3, $4) RETURNING *';
    const result = await pool.query(query, [userId, name, x, y]);
    return result.rows[0];
};

const updateCastleResources = async (castleId, material, food) => {
    const query = `
        UPDATE castles
        SET material = material + $1, food = food + $2
        WHERE id = $3
        RETURNING *`;
    const result = await pool.query(query, [material, food, castleId]);
    return result.rows[0];
};

const updateBuildingCount = async (castleId, buildingType, count) => {
    const query = `
        INSERT INTO buildings (castle_id, ${buildingType})
        VALUES ($1, $2)
        ON CONFLICT (castle_id)
        DO UPDATE SET ${buildingType} = buildings.${buildingType} + $2
        RETURNING *`;
    const result = await pool.query(query, [castleId, count]);
    return result.rows[0];
};

const getCastleByIdAndUser = async (castleId, userId) => {
    const query = `
        SELECT c.*
        FROM castles c
        WHERE c.id = $1 AND c.user_id = $2`;
    const result = await pool.query(query, [castleId, userId]);
    return result.rows[0];
};

const getCastleByLocation = async (x, y) => {
    const result = await pool.query(
        `SELECT id FROM castles WHERE x = $1 AND y = $2`,
        [x, y]
    );
    return result.rows[0] || null; // Return the castleId if found, otherwise null
};


module.exports = {
    createCastle,
    updateCastleResources,
    getCastleByIdAndUser,
    updateBuildingCount,
    getAllCastlesByUserId,
    getCastleByLocation
};
