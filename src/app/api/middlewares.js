const utils = require('../components/app-util');
const jsonSchema = require('../components/json-schema');
const log = require('../components/log')(module);

/**
 * RaceAPIMiddlewares
 */
class RaceAPIMiddlewares {
    validateIntParam(next, param, paramName) {
        return utils.toInteger(param) ? next() : next(`Incorrect ${paramName} ${param}`);
    }

    validateStringParam(next, param, paramValues, paramName) {
        return paramValues.includes(param) ? next() : next(`Incorrect ${paramName} ${param}`);
    }

    validateParamByRegex(next, param, paramRex, paramName) {
        return paramRex.test(param) ? next() : next(`Incorrect ${paramName} ${param}`);
    }

    async validateBody(req, next, schema) {
        try {
            const {body} = req;

            await jsonSchema.validate(body, schema);
            next();
        } catch (error) {
            next(error);
        }
    }

    validateBodyTupleConsistency(req, next, paramList) {
        const {body} = req;

        const valid =
            (paramList.map(([p1, p2]) => !!body[p1] === !!body[p2]).every(el => el));

        return valid ? next() : next('Inconsistent body params');
    }


    getClientHallID(req, next) {
        const clientIP = req.header('x-real-ip') || req.ip;

        if (!clientIP) {
            next(`Can't recognize IP. Forbidden.`);
        }

        req.hallID = utils.getHallIDfromIP(clientIP);
        log.verbose(`Get hall ID by client IP: ${req.hallID}`);

        next();
    }

    getClientRaceID(req, next) {
        const {hallID} = req;

        if (hallID) {

        }
    }
}

module.exports = new RaceAPIMiddlewares();
