const baseController = require('./baseController');
const log = require('../../components/log')(module);
const hallInfoModel = require('../Models/hallInfoModel');

class hallInfoController extends baseController{

    async getHallInfo(req, res, next) {
        const { country } = req.query;
        const { hall_id } = req.body;
        try {
            let hallModel = new hallInfoModel(country);
            const data = await hallModel.getHallInfo(hall_id);
            return res.send(data);
        } catch (error) {
            log.error(error);
            return  this._send(res, error.toString(), 500);
        }
    }

}

module.exports = new hallInfoController();

