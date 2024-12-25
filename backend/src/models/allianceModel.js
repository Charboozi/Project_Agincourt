const pool = require('../config/db');

const createAlliance = async (leaderId, allianceName) => {
    const result = await pool.query(
        `INSERT INTO alliances (leader_id, alliance_name)
        VALUES ($1, $2) RETURNING *`,
        [leaderId, allianceName]
    );
    return result.rows[0];
};

const joinAlliance = async (userId, allianceId, rank) => {
    const result = await pool.query(
        `INSERT INTO alliance_members (user_id, alliance_id, rank)
        VALUES ($1, $2, $3) RETURNING *`,
        [userId, allianceId, rank]
    );
    return result.rows[0];
};

const getUserAlliance = async (userId) => {
    const result = await pool.query(
        `SELECT * FROM alliances 
        JOIN alliance_members ON alliances.id = alliance_members.alliance_id
        WHERE alliance_members.user_id = $1`,
        [userId]
    );
    return result.rows[0];
};

const getAllianceMembers = async (allianceId) => {
    const result = await pool.query(
        `SELECT * FROM alliance_members
        WHERE alliance_id = $1`,
        [allianceId]
    );
    return result.rows;
};

const getAllianceMember = async (userId) => {
    const result = await pool.query(
        `SELECT * FROM alliance_members
        WHERE user_id = $1`,
        [userId]
    );
    return result.rows[0];
};

const leaveAlliance = async (userId) => {

    const result = await pool.query(
        `DELETE FROM alliance_members
         WHERE user_id = $1 RETURNING *`,
        [userId]
    );

    return result.rows[0];
};

const deleteAlliance = async (leaderId) => {
    const result = await pool.query(
        `DELETE FROM alliances
        WHERE leader_id = $1 RETURNING *`,
        [leaderId]
    );
    return result.rows[0];
};

module.exports = {
    createAlliance,
    joinAlliance,
    getUserAlliance,
    getAllianceMembers,
    getAllianceMember,
    leaveAlliance,
    deleteAlliance
}