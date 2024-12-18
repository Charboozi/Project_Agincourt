const pool = require('../config/db');

const getAllCastlesWithUsernames = async () => {
    const query = `
        SELECT c.*, u.username
        FROM castles c
        INNER JOIN users u ON c.user_id = u.id
    `;
    const result = await pool.query(query);
    return result.rows; // Returns castles with their corresponding usernames
};
module.exports = {
    getAllCastlesWithUsernames
};