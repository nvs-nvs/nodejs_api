const onFinished = require('on-finished');
const log = require('../../../app/components/log')(module);

const logger = function(req, res, next) {
    onFinished(res, () => {
        log.verbose(req.method, req.url, req.ip, res.statusCode);
    });

    next();
};

module.exports = logger;
