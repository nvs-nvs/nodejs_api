const axios = require('axios');

class AuthModel{

    // static checkAuth(){
    //     axios('https://id.bingo-boom.ru', {
    //         method: 'GET',
    //         //method: 'POST',
    //         // headers: {
    //         //     'Content-Type': 'application/json'
    //         // },
    //         // data
    //     })
    //         .then(responce => {
    //                 console.log(responce);
    //                return {'success': true,};
    //             },
    //             (error) => {
    //                 console.log(error);
    //             }
    //         )
    // }

    static async auth(req, res, next) {
        try {
            const data = await axios('https://id.bingo-boom.ru', {
                        method: 'GET',
                        //method: 'POST',
                        // headers: {
                        //     'Content-Type': 'application/json'
                        // },
                        // data
                    });
            return data.data;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = AuthModel;