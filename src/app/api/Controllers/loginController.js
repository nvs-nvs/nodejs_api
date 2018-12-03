const hallInfoModel = require('../Models/hallInfoModel');

class loginController{

    async my_test(req, res, next) {
        try {
            let hall = new hallInfoModel('ru');
            const data = await hall.getFirstGameID();
            res.send(data);
        } catch (error) {
            //log.error(error);
            return this.send(res, error, 500);
        }
    }

}

module.exports = new loginController();
