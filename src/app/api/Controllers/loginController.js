const hallInfoModel = require('../Models/hallInfoModel');
const log = require('../../components/log')(module);
const baseController = require('./baseController');
const authModel = require('../Models/authModel');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const config = require('../../config');

class loginController extends baseController {
    
    async login(req, res, next) {
        try {
            const {login, password } = req.body;
            const answer = await authModel.auth(req, res, next);
            if(answer.error === true){
                return res.status(401).send({
                    'error' : true,
                    'message' : answer.description
                });
            }
            if(answer.data.password === false){
                return res.status(401).send({
                    'error' : true,
                    'message' : 'Пароль не верен.'
                });
            }
    
            if(!answer.data.email){
                return res.status(401).send({
                    'error' : true,
                    'message' : 'У пользователя не заполнен email.'
                });
            }
    
            if(!answer.data.name){
                return res.status(401).send({
                    'error' : true,
                    'message' : 'У пользователя не заполнено фио.'
                });
            }
            const token = jwt.sign(
                answer.data,
                config.auth.token_key,
                { expiresIn: '24 hours' }
            );
            return res.send({
                    auth: true,
                    token: token,
                    user: answer.data
                });
        } catch (error) {
            log.error(error);
            return  next(error);
        }
    }

}

module.exports = new loginController();
