const pool = require('../config/db');

const getAllCastlesByUserId = async (userId) => {
    const query = 'SELECT * FROM castles WHERE user_id = $1';
    const result = await pool.query(query, [userId]);
    return result.rows; // Returns all rows (castles) for the specified kingdom
};

const createCastle = async (userId, name) => {
    const query = 'INSERT INTO castles (user_id, name) VALUES ($1, $2) RETURNING *';
    const result = await pool.query(query, [userId, name]);
    return result.rows[0];
};

const updateCastleResources = async (castleId, gold, wood, food) => {
    const query = `
        UPDATE castles
        SET gold = gold + $1, material = material + $2, food = food + $3
        WHERE id = $4
        RETURNING *`;
    const result = await pool.query(query, [gold, wood, food, castleId]);
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

module.exports = {
    createCastle,
    updateCastleResources,
    getCastleByIdAndUser,
    updateBuildingCount,
    getAllCastlesByUserId
};
