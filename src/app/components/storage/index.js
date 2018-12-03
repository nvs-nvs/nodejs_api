const config = require('../../../app/components/config');
const MySQLConnection = require('./connections/MySQLConnection');

/**
 * Encapsulates connections to storage
 */
class Storage {
    constructor() {
        this.connections = {
            'mysql-master' : new MySQLConnection(config.storage['mysql-master']),
            'mysql-replica': new MySQLConnection(config.storage['mysql-replica'])
        };
    }

    /**
     * @returns {Promise.<*[]>} no
     */
    init() {
        return Promise.all(Object.keys(this.connections).map(key => this.connections[key].initDb()));
    }

    /**
     * @param {String<"postgres"|"mysql">} storageType Type of storage (postgres, mysql, etc...)
     * @returns {Promise.<any>} Resolves with connection, rejects with error
     */
    getConnection(a, b) {
        let storageType = a + '-' + b;
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