const baseController = require('./BaseController');
const log = require('../../components/log')(module);
const hallInfoModel = require('../Models/HallInfoModel');

class hallInfoController extends baseController{

    async getHallInfo(req, res, next) {
        const { country } = req.query;
        const { hall_id } = req.body;
        const { isActive } = req.body;
        const { vip } = req.body;
        let clients = [];
        let hallInfo = {};
        try {
            let hallModel = new hallInfoModel(country);
            const clients = await hallModel.getHallInfo(hall_id, isActive, vip);
            if(clients.length > 0){
                hallInfo = {
                    gs_id : clients[0]['gs_id'],
                    permission: clients[0]['permission'],
                };
            }
            return res.send({
                clients, hallInfo
            });
        } catch (error) {
            log.error(error);
            return  this._send(res, error.toString(), 500);
        }
    }

}

module.exports = new hallInfoController();

