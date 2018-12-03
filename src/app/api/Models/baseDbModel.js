const constants = require('./constants');

class baseDbModel {
    constructor(country) {
        this.db_name = baseDbModel.getDbFromCountry(country);
        if (!this.db_name) {
            throw new Error(`Country: ${country} not allowed`);
        }
    }

    static getDbFromCountry(country){
        switch (country) {
            case constants.constCountryList.COUNTRY_RU:
                return constants.constDbList.DB_GAME_RU;
            case constants.constCountryList.COUNTRY_KAZ:
                return constants.constDbList.DB_GAME_KAZ;
            case constants.constCountryList.COUNTRY_KGZ:
                return constants.constDbList.DB_GAME_KGZ;
            case constants.constCountryList.COUNTRY_GEO:
                return constants.constDbList.DB_GAME_GEO;
            case constants.constCountryList.COUNTRY_ARM:
                return constants.constDbList.DB_GAME_ARM;
            default :
                return null;
        }
    }
}
module.exports = baseDbModel;
