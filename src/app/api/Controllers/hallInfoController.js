const baseController = require('./baseController');
const log = require('../../../app/components/log')(module);
const hallInfoModel = require('../../api/Models/hallInfoModel');

class hallInfoController extends baseController{

    async getAllHalls(req, res, next) {
        try {
            let hall = new hallInfoModel('ru');
            const data = await hall.getFirstGameID();
            return res.send(data);
        } catch (error) {
            log.error(error);
            return  this._send(res, error.toString(), 500);
        }
    }

}

module.exports = new hallInfoController();

