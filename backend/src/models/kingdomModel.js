const pool = require('../config/db');

const createKingdom = async (userId, name) => {
    const query = 'INSERT INTO kingdoms (user_id, name) VALUES ($1, $2) RETURNING *';
    const result = await pool.query(query, [userId, name]);
    return result.rows[0];
};

const getKingdomByUserId = async (userId) => {
    const query = 'SELECT * FROM kingdoms WHERE user_id = $1';
    const result = await pool.query(query, [userId]);
    return result.rows[0];
};

module.exports = {
    createKingdom,
    getKingdomByUserId
};
