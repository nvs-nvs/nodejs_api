const MySQL = require('promise-mysql');
const AbstractConnection = require('./AbstractConnection');
const log = require('../../../../app/components/log.js')(module);

class MySQLConnection extends AbstractConnection {
    constructor(config) {
        super(config);
        this.config = {
            ...(this.config),
            supportBigNumbers: true,
            queryFormat: this._queryFormat,
        };
    }

    async initDb() {
        try {
            if (!this.pool) {
                this.pool = await MySQL.createPool(this.config);
                log.info(`Created pool of MySQL connections with size ${this.config.poolSize}`);
            }
        } catch (error) {
            log.error(error);
            process.exit(1);
        }
    }

    getConnection() {
        return this.pool;
    }

    _queryFormat(query, values) {
        if (!values) {
            return query;
        }
        return query.replace(/\:(\w+)/g, function(txt, key) {
            if (values.hasOwnProperty(key)) {
                return this.escape(values[key]);
            }
            return txt;
        }.bind(MySQL));
    }
}

module.exports = MySQLConnection;
