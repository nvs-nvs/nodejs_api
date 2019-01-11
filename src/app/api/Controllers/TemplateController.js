const baseController = require('./BaseController');
const log = require('../../components/log')(module);
const templateModel = require('../Models/TemplateModel');

class TemplateController extends baseController{
    
    async getAllTemplates(req, res, next) {
        const { country } = req.query;
        try {
            let templateModel = new templateModel(country);
            const templates = await templateModel.getAllTemplates();
            return res.send({
                templates
            });
        } catch (error) {
            log.error(error);
            return  this._send(res, error.toString(), 500);
        }
    }
}

module.exports = new TemplateController();