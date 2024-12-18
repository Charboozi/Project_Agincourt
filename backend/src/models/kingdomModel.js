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

const updateKingdomResources = async (userId, goldChange) => {
    return await pool.query(
        `UPDATE kingdoms 
         SET gold = gold + $1
         WHERE user_id = $2 RETURNING *`,
        [goldChange, userId]
    );
};


module.exports = {
    createKingdom,
    getKingdomByUserId,
    updateKingdomResources
};
