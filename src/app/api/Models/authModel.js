const axios = require('axios');

class AuthModel{
    checkAuth(){
        axios('https://id.bingo-boom.ru', {
            method: 'GET',
            //method: 'POST',
            // headers: {
            //     'Content-Type': 'application/json'
            // },
            // data
        })
            .then(responce => {
                    console.log(responce);
                   return {'success': true,};
                },
                (error) => {
                    console.log(error);
                }
            )
    }
}

module.exports = new AuthModel();