const hallInfoModel = require('../Models/hallInfoModel');
const log = require('../../../app/components/log')(module);
const baseController = require('./baseController');

class loginController extends baseController {

    async login(req, res, next) {
        try {

        } catch (error) {
            log.error(error);
            return  this._send(res, error.toString(), 500);
        }
    }

}

module.exports = new loginController();