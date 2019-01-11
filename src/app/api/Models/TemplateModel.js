const storage = require('../../../app/components/storage');
const mysql = require('promise-mysql');
const log = require('../../../app/components/log.js')(module);
const baseDbModel = require('./BaseDbModel');
const constants = require('./constants');

/**
 * @class {hallInfoModel}
 */
class TemplateModel extends baseDbModel{
    constructor(country){
        super(country);
    }
    /**
     * @returns {Promise.<*>} Map
     */
    async getAllTemplates() {
        const mdbPool = storage.getConnection(
            constants.constDbList.DB_TYPE_MYSQL,
            constants.constDbList.DB_REPLICA
        );
        const conn = await (await mdbPool).getConnection();
        let query = `SELECT DISTINCT template_name FROM templates_distr`;
        
        try {
            return await conn.query(query);
        } catch (error) {
            throw error;
        } finally {
            await (await mdbPool).releaseConnection(conn);
        }
    }
}

module.exports = TemplateModel;
