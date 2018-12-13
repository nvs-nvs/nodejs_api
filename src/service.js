const bodyParser = require('body-parser');
const Express = require('express');
const passport = require('passport');
require('./app/components/passport')(passport);

const storage = require('./app/components/storage');
(async () => {
    await storage.init();
})();

/* Модуль Конфига */
const config = require('./app/components/config');

/* Модуль Лога Приложения */
const log = require('./app/components/log')(module);

/* Лог Api */
const apiLog = require('./app/components/middleware/logger');

/* Роуты Апи */
const apiRoutes = require('./app/api/routes/api-routes');

/* Роуты Login */
const loginRoutes = require('./app/api/routes/login-routes');

/** @type {Object} */
const api = new Express();

log.info(`Application running on environment '${process.env.NODE_ENV || 'production'}'`);

process.on('unhandledRejection', error => {
    log.error('unhandledRejection', error);
});

api.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, X-Auth-Token, Authorization, Content-Length, X-Requested-With');
    //intercepts OPTIONS method
    'OPTIONS' === req.method ? res.sendStatus(200) : next();
});

api.use(bodyParser.json());
api.use(apiLog);

api.use('/api', passport.initialize());

api.use('/api', passport.authenticate('jwt', {session:false}), apiRoutes);

api.use('/login', loginRoutes);

api.all('/*', (req, res, next) => {
    next(`Unknown route ${req.originalUrl}`);
});

api.use((error, req, res, next) => {
    const result = {
        error: true,
        message: error.message || error,
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