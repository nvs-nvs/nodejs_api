const bodyParser = require('body-parser');
const Express = require('express');

/* Модуль Конфига */
const config = require('./app/components/config');

/* Модуль Лога Приложения */
const log = require('./app/components/log')(module);

/* Лог Api */
const apiLog = require('./app/components/middleware/logger');
const hall = require('./app/api/Models/hallInfoModel');

/* Роуты Апи */
const apiRoutes = require('./app/api/routes/api-routes');

/** @type {Object} */
const api = new Express();

log.info(`Application running on environment '${process.env.NODE_ENV || 'production'}'`);

process.on('unhandledRejection', error => {
    log.error('unhandledRejection', error);
});

// api.use(function(req, res, next) {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, X-Auth-Token, Authorization, Content-Length, X-Requested-With');
//     //intercepts OPTIONS method
//     'OPTIONS' === req.method ? res.sendStatus(200) : next();
// });

api.use(bodyParser.json());
api.use(apiLog);

api.use('/api', apiRoutes);

api.get('/login', (req, res, next) => {
    res.send({"dsds":"dd"});
});

api.all('/*', (req, res, next) => {
    next(`Unsupported endpoint ${req.originalUrl}`);
});

api.use((error, req, res, next) => {

    const result = {
        success: false,
        error: {
            message: error.message || error,
        },
    };
    res.status(error.code || 400).send(result);
});

try {
    const {port} = config.api;
    api.listen(port, error => {
            if (error) {
                throw error;
            }
            const serverLog = `on [http://localhost:${port}]`;
            const environment = process.env.NODE_ENV || 'production';
            log.info(`Engineer Panel API Server started ${serverLog} environment ['${environment}']`);
        });
    } catch (error) {
        log.error(`Engineer Panel Server starting error:`, error);
        process.exit(1);
    }