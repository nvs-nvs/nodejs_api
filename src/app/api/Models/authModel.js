const axios = require('axios');
const Buffer = require('buffer').Buffer;
const config = require('../../config');

class AuthModel{
    static async auth(req, res, next) {
        try {
            const { login, password } = req.body;
            
            const result = await axios(`${config.auth.auth_url}/${login}/${password}`, {
                        method: 'POST',
                         headers: {
                             'Authorization' : `Basic ${new Buffer(`${config.auth.client_id}:${config.auth.client_secret}`).toString('base64')}`,
                             'Content-Type': 'application/json'
                         },
                    });
            let data = result.data;
            return result.data;
        } catch (error) {
            next(error);
        }
    }
}

module.exports = AuthModel;