const templateTypes = require('mobitel-json-schema-template');

const postLoginData = {
    id: 'login_schema',
    type: 'object',
    additionalProperties: false,
    required: [
        'login',
        'password',
    ],
    properties: {
        login: templateTypes.string().done(),
        password: templateTypes.string().done(),
    }
};

module.exports = {
    post: postLoginData,
};
