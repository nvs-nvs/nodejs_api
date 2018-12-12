const templateTypes = require('mobitel-json-schema-template');

const hallsSchema = {
    type: 'object',
    additionalProperties: true,
    required: [
        'hall_id',
    ],
    properties: {
        hall_id: templateTypes.number().min(0).done()
    }
};

module.exports = {
    post: hallsSchema,
};
