const templateTypes = require('mobitel-json-schema-template');

const postLoginSchema = {
    id: 'login_schema',
    type: 'object',
    additionalProperties: false,
    required: [
        'login',
        'password',
        'country',
    ],
    properties: {
        country: templateTypes.string().enum(['ru', 'kaz', 'kgz', 'arm', 'geo']).done(),
        password: templateTypes.string().done(),
        login: templateTypes.string().done(),
    }
};

module.exports = {
    post: postLoginSchema,
};
