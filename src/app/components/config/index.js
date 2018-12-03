const path = require('path');
/* Объект Проверки json по схеме */
const jsonSchema = require('../../../app/components/json-schema');

/* Конфиг Схемы конфига приложения */
const confSchema = require('./schema.js');

// set path to config file
let appConfigFile = path.join(__dirname, '../../../app/config.json');

// load config
try {
    appConfig = require(appConfigFile);
} catch (error) {
    throw error;
}

// validation config JSON-data by JSON-schema
const validationResult = jsonSchema.validateSync(appConfig, confSchema);
if (!validationResult.success) {
    throw new Error(`Config: Validation error(s): ${validationResult.error}`);
}

// lock config
for (const key in appConfig) {
    if (!appConfig.hasOwnProperty(key)) {
        continue;
    }

    if (typeof appConfig[key] === 'object') {
        appConfig[key] = Object.freeze(appConfig[key]);
    }
}
appConfig = Object.freeze(appConfig);
console.info('Config: loaded');

module.exports = appConfig;
