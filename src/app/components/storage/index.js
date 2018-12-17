const config = require('../../../app/components/config');
const MySQLConnection = require('./connections/MySQLConnection');

/**
 * Encapsulates connections to storage
 */
class Storage {
    constructor(opts) {
        this.connections = {
            'mysql-master' : new MySQLConnection(config.storage['mysql-master']),
            'mysql-replica': new MySQLConnection(config.storage['mysql-replica'])
        };
    }

    /**
     * @returns {Promise.<*[]>}
     */
    async init() {
        await Promise.all(Object.keys(this.connections).map(key => this.connections[key].initDb()));
    }

    /**
     * @param {String<"postgres"|"mysql">} Type of storage (postgres, mysql, etc...)
     * @param {String<"master"|"replica">} Type of connection (master, replica)
     * @returns {Promise.<any>} Resolves with connection, rejects with error
     */
    getConnection(dbType, dbConnType) {
        let storageType = `${dbType}-${dbConnType}`;
        const self = this;
        try {
            if (! Object.prototype.hasOwnProperty.call(self.connections, storageType)) {
                throw new Error(`Incorrect storage type '${storageType}'`);
            }

            return self.connections[storageType].getConnection();
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new Storage();