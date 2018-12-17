const storage = require('../../../app/components/storage');
const mysql = require('promise-mysql');
const log = require('../../../app/components/log.js')(module);
const baseDbModel = require('./baseDbModel');
const constants = require('./constants');

/**
 * @class {hallInfoModel}
 */
class hallInfoModel extends baseDbModel{
    constructor(country){
        super(country);
    }
    /**
     * @param {Array} gameKinds gk
     * @param {Date} startDate date
     * @returns {Promise.<*>} Map
     */
    async getHallInfo(hall_id) {
        const mdbPool = storage.getConnection(
            constants.constDbList.DB_TYPE_MYSQL,
            constants.constDbList.DB_MASTER
        );
        const conn = await (await mdbPool).getConnection();
        const query =
        `
        SELECT
        c.*,
        h.gs_id,
        h.permission
        FROM
        ${this.db_name}.clients as c
        LEFT JOIN
        ${this.db_name}.halls as h
        using(hall_id)
        where hall_id = :hall_id
        `;
        
        try {
            return await conn.query(query, {hall_id});
        } catch (error) {
            throw error;
        } finally {
            await (await mdbPool).releaseConnection(conn);
        }
    }
}

module.exports = hallInfoModel;
