const path = require('path');
const winston = require('winston');
const WinstonDailyRotateFile = require('winston-daily-rotate-file');
const config = require('../../app/components/config');

const { combine, timestamp, label, printf } = winston.format;

const myFormat = printf(info => {
    return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
});

/**
 * Customize logger timestamp format to locale datetime with milliseconds
 * @returns {string} Formatted datetime string
 */
const timestampFormat = () => {
    const datetime = new Date();
    const ms = String(datetime.getMilliseconds() % 1000);
    return `${datetime.toLocaleString()},${ms.padEnd(3, 0)}`;
};
/**
 * Customized settings for logger module "winston".
 * @module log
 * @param {Object} module Current application module.
 * @returns {{error: Function, warn: Function, info: Function, verbose: Function, debug: Function, silly: Function}}
 *     Configured logger object.
 */
const getLogger = function getLogger(module) {
    // a label with the name of the file, which displays the message
    /** @warn May be an error on unit-tests */
    let logFilename = module.filename.replace(process.cwd(), '')
        .split(path.sep)
        .slice(-2)
        .join(path.sep);
    if (logFilename[0] !== path.sep) {
        logFilename = path.sep + logFilename;
    }
    // specifies the transport of logs depending on the settings
    const setTransports = [];
    /** @type {{type, consoleLevel, filePath, fileLevel}} */
    const logConfig = Object.assign({}, config.log);
    // logging in console
    if (logConfig.type === 'console' || logConfig.type === 'both') {
        setTransports.push(new (winston.transports.Console)({
            timestamp: timestampFormat,
            colorize: true,
            level: logConfig.consoleLevel,
            label: logFilename,
            json: false,
        }));
    }
    // logging in file
    if (logConfig.type === 'file' || logConfig.type === 'both') {
        setTransports.push(new WinstonDailyRotateFile({
            filename: logConfig.filePath,
            level: logConfig.fileLevel,
            timestamp: timestampFormat,
            label: logFilename,
            json: true,
        }));
    }
    // return customized logger
    return winston.createLogger({
        exitOnError: false,
        transports: setTransports,
        format: combine(
            label({ label: module.id }),
            timestamp(),
            myFormat
        )
    });
};

module.exports = getLogger;
