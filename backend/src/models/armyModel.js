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

const MergeUserArmiesCheck = async (x, y, userId, armyId) => {
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

const addArmyCompany = async (mainArmyId, alliedArmyId) => {
    const result = await pool.query(
        `INSERT INTO army_companies (main_army_id, allied_army_id)
         VALUES ($1, $2)
         RETURNING *`,
        [mainArmyId, alliedArmyId]
    );
    return result.rows[0];
};

const removeArmyCompany = async (alliedArmyId) => {
    const result = await pool.query(
        `DELETE FROM army_companies
         WHERE allied_army_id = $1
         RETURNING *`,
        [alliedArmyId]
    );
    return result.rows[0];
};

const getAccompaniedArmies = async (mainArmyId) => {
    const result = await pool.query(
        `SELECT * FROM armies
         JOIN army_companies ON armies.id = army_companies.allied_army_id
         WHERE army_allies.main_army_id = $1`,
        [mainArmyId]
    );
    return result.rows;
};

const moveAccompaniedArmies = async (mainArmyId, x, y) => {
    const result = await pool.query(
        `UPDATE armies
         SET x = $1, y = $2
         WHERE id IN (
             SELECT allied_army_id
             FROM army_companies
             WHERE main_army_id = $3
         )
         RETURNING *`,
        [x, y, mainArmyId]
    );
    return result.rows;
};

const checkForAccompaniedArmy = async (x, y, excludeArmyId) => {
    const result = await pool.query(
        `SELECT * FROM armies
         WHERE x = $1 AND y = $2 AND id != $3 AND main_army_id IS NULL`,
        [x, y, excludeArmyId]
    );
    return result.rows[0];
};

const allyArmyCheck = async (x, y, userId) => {
    const result = await pool.query(
        `SELECT armies.*, ally_armies.id AS ally_army_id
         FROM armies
         JOIN user_alliances
           ON (user_alliances.user_id = $3)
         LEFT JOIN armies AS ally_armies
           ON (ally_armies.user_id = user_alliances.ally_user_id)
         WHERE armies.x = $1
           AND armies.y = $2`,
        [x, y, userId]
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

    MergeUserArmiesCheck,

    CheckLocationForArmy,

    allyArmyCheck,
    addArmyCompany,
    removeArmyCompany,
    getAccompaniedArmies,
    moveAccompaniedArmies,
    checkForAccompaniedArmy               
}