class AbstractConnection {
    constructor(config) {
        if (new.target === AbstractConnection) {
            throw new TypeError('You can not create abstract connection');
        }

        this.config = {...config};
    }

    initDb() {
        throw new TypeError('This method must be overridden');
    }

    getConnection() {
        throw new TypeError('This method must be overridden');
    }
}

module.exports = AbstractConnection;
