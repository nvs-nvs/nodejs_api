const storage = require('../../../app/components/storage');
const mysql = require('promise-mysql');
const log = require('../../../app/components/log.js')(module);
const baseDbModel = require('./BaseDbModel');
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
    async getHallInfo(hall_id, isActive, vip) {
        const mdbPool = storage.getConnection(
            constants.constDbList.DB_TYPE_MYSQL,
            constants.constDbList.DB_MASTER
        );
        const conn = await (await mdbPool).getConnection();
        let query =
        `
        SELECT
            c.*,
            h.gs_id,
            h.permission
        FROM
            ${this.db_name}.clients as c
        LEFT JOIN
            ${this.db_name}.halls as h
        USING(hall_id)
        WHERE hall_id = :hall_id
        `;
        
        if(isActive){
            query = `${query} AND (
                activ_dttm BETWEEN DATE_SUB(NOW(), INTERVAL 6 HOUR) AND NOW()
                OR
                boot_dttm BETWEEN DATE_SUB(NOW(), INTERVAL 6 HOUR) AND NOW()
            ) `;
        }
    
        if(vip){
            query = `${query} AND vip = 1 `;
        }
        
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
