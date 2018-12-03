const ipaddr = require('ipaddr.js');
const ip = require('ip');

/** Utilities for application */
class AppUtilities {
    /** class constructor */
    constructor() {
        this._CLASS = this.constructor.name.toString();
    }

    /**
     * @param {*} value Checked value
     * @returns {Boolean} TRUE if value is object, or FALSE
     */
    isObject(value) {
        return value !== null && typeof value === 'object' && !Array.isArray(value);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @param {*} value Checked value
     * @returns {Boolean} TRUE if value is float number, or FALSE
     */
    isFloat(value) {
        return Number(value) === value && value % 1 !== 0;
    }

    /**
     * @param {*} value Value for transform
     * @returns {boolean} Boolean from value
     */
    toBoolean(value) {
        return Boolean(value);
    }

    /**
     * @param {*} value Value for transform
     * @returns {Number|Null} Correct number, or NULL
     */
    toInteger(value) {
        value = parseInt(value, 10);
        return Number.isNaN(value) ? null : value;
    }

    /**
     * @param {*} value Value for transform
     * @returns {Number|Null} Correct float number, or NULL
     */
    toFloat(value) {
        value = parseFloat(value);
        return Number.isNaN(value) ? null : value;
    }

    /**
     * @param {*} value Value for transform
     * @returns {Number|Null} Correct rounded number, or NULL
     */
    toRoundInt(value) {
        value = parseFloat(value);
        return Number.isNaN(value) ? null : Math.round(value);
    }

    /**
     * @param {*} value Value for transform
     * @returns {Date|Null} Correct date, or NULL
     */
    toDate(value) {
        const parsedDate = Date.parse(value);
        return parsedDate ? new Date(parsedDate) : null;
    }

    /**
     * @param {*} value Value for transform
     * @returns {Object|Null} Not empty object, or NULL
     */
    toObject(value) {
        const self = this;
        return (self.isObject(value) && Object.keys(value).length) ? value : null;
    }

    /**
     * @param {*} value Value for transform
     * @returns {Array|Null} Not empty array, or NULL
     */
    toArray(value) {
        return (Array.isArray(value) && value.length) ? value : null;
    }

    /**
     * @param {*} value Value for transform
     * @returns {String|Null} Not empty string, or NULL
     */
    toString(value) {
        return String(value).trim() || null;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Transform to simple types using the type name
     * @param {*} value Source value
     * @param {String} type Type name for transform
     * @returns {*} Correct and not empty value, or string from value
     */
    typification(value, type) {
        const self = this;

        switch (type) {
            case 'boolean': {
                return self.toBoolean(value);
            }
            case 'integer': {
                return self.toInteger(value);
            }
            case 'float': {
                return self.toFloat(value);
            }
            case 'round': {
                return self.toRoundInt(value);
            }
            case 'date': {
                return self.toDate(value);
            }
            case 'object': {
                return self.toObject(value);
            }
            case 'array': {
                return self.toArray(value);
            }
            default: {
                return self.toString(value);
            }
        }
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @param {Number} min Minimum value for random number generation
     * @param {Number} max Maximum value for random number generation
     * @returns {Number} Random generated number
     */
    randomInt(min = 1, max = 10) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * @param {String} string String for modification
     * @returns {String} String with first letter in lowercase
     */
    firstLetterToLowerCase(string) {
        return string[0].toLowerCase() + string.substr(1);
    }

    getHallIDfromIP(clientIP) {
        let isIP = ipaddr.process(clientIP);
        isIP = isIP.octets.join('.');
        return Math.floor((ip.toLong(isIP) - ip.toLong('172.16.0.0')) / 128);
    }
}

module.exports = new AppUtilities();
