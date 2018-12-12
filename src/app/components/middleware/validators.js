const utils = require('../../components/app-util');
const jsonSchema = require('../../components/json-schema');
const log = require('../../components/log')(module);

/**
 * RaceAPIMiddlewares
 */
class Validators {
    
    validateIntParam(next, param, paramName) {
        return utils.toInteger(param) ? next() : next(`Incorrect ${paramName} ${param}`);
    }
    
    validateStringParam(next, param, paramValues, paramName) {
        return paramValues.includes(param) ? next() : next(`Incorrect ${paramName} ${param}`);
    }
    
    validateParamByRegex(next, param, paramRex, paramName) {
        return paramRex.test(param) ? next() : next(`Incorrect ${paramName} ${param}`);
    }
    
    async validateGetBody(req, next, schema) {
        try {
            await jsonSchema.validate(req.query, schema);
            next();
        } catch (error) {
            next(error);
        }
    }
    
    async validatePostBody(req, next, schema) {
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
}

module.exports = new Validators();