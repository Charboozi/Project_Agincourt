const pool = require('../config/db');

const createArmy = async (userId, castleId, cavalry, infantry, archers, x, y) => {
    const result = await pool.query(
        `INSERT INTO armies (user_id, castle_id, cavalry, infantry, archers, x, y)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [userId, castleId, cavalry, infantry, archers, x, y]
    );
    return result.rows[0];
};

const getAllArmies = async (userId) => {
    const result = await pool.query(
        `SELECT * FROM armies WHERE user_id = $1`,
        [userId]
    );
    return result.rows;
};

const getArmyById = async (armyId, userId) => {
    const result = await pool.query(
        `SELECT * FROM armies WHERE id = $1 AND user_id = $2`,
        [armyId, userId]
    );
    return result.rows[0];
};

const moveArmy = async (armyId, x, y, castleId) => {
    const result = await pool.query(
        `UPDATE armies SET x = $1, y = $2, castle_id = $3 WHERE id = $4 RETURNING *`,
        [x, y ,castleId ,armyId]
    );
    return result.rows[0];
};

const deleteArmy = async (armyId) => {
    await pool.query(`DELETE FROM armies WHERE id = $1`, [armyId]);
};

const updateArmyTroops = async (armyId, cavalry, infantry, archers) => {
    const result = await pool.query(
        `UPDATE armies
         SET cavalry = cavalry + $1, infantry = infantry + $2, archers = archers + $3
         WHERE id = $4 RETURNING *`,
        [cavalry, infantry, archers, armyId]
    );
    return result.rows[0];
};

const MergeArmiesCheck = async (x, y, userId, armyId) => {
    const result = await pool.query(
    `SELECT * FROM armies 
     WHERE x = $1 AND y = $2 AND user_id = $3 AND id != $4`,
    [x, y, userId, armyId]
    );

    return result.rows[0];
};

const CheckLocationForArmy = async (x, y) => {
    const result = await pool.query(
    `SELECT * FROM armies WHERE x = $1 AND y = $2`,
    [x, y]
    );

    return result.rows[0];
};

module.exports = {
    createArmy,
    getAllArmies,
    getArmyById,
    moveArmy,
    deleteArmy,
    updateArmyTroops,
    MergeArmiesCheck,
    CheckLocationForArmy
}