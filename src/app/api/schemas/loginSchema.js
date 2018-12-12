const templateTypes = require('mobitel-json-schema-template');

const postLoginSchema = {
    id: 'login_schema',
    type: 'object',
    additionalProperties: false,
    required: [
        'login',
        'password',
    ],
    properties: {
        password: templateTypes.string().done(),
        login: templateTypes.string().done(),
    }
};

module.exports = {
    post: postLoginSchema,
};
