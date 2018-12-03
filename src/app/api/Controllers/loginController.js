const hallInfoModel = require('../Models/hallInfoModel');
const log = require('../../components/log')(module);
const baseController = require('./baseController');
const authModel = require('../Models/authModel');

class loginController extends baseController {

    async login(req, res, next) {
        try {
            const {login, password } = req.body;
            const data = await authModel.auth();
            return res.send(data);
        } catch (error) {
            log.error(error);
            return  this._send(res, error.toString(), 500);
        }
    }

}

module.exports = new loginController();
