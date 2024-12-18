const pool = require('../config/db');

const createAlliance = async (userId, allyUserId) => {
    const result = await pool.query(
        `INSERT INTO user_alliances (user_id, ally_user_id)
        VALUES ($1, $2) RETURNING *`,
        [userId, allyUserId]
    );
    return result.rows[0];
};

const getAllyById = async (userId, allyUserId) => {
    const result = await pool.query(
        `SELECT * FROM user_alliances 
        WHERE user_id = $1 AND ally_user_id = $2`,
        [userId, allyUserId]
    );
    return result.rows[0];
};

const getAllAlliesById = async (userId) => {
    const result = await pool.query(
        `SELECT ua.*, u.username AS ally_user_name
             FROM user_alliances ua
             JOIN users u ON ua.ally_user_id = u.id
             WHERE ua.user_id = $1`,
        [userId]
    );
    return result.rows;
};

const breakAlliance = async (userId, allyUserId) => {
    const result = await pool.query(
        `DELETE FROM user_alliances
         WHERE user_id = $1 AND ally_user_id = $2`,
        [userId, allyUserId]
    );
    return result.rows[0];
}

module.exports = {
    createAlliance,
    getAllyById,
    getAllAlliesById,
    breakAlliance
}