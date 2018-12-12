const templateTypes = require('mobitel-json-schema-template');

const countrySchema = {
    type: 'object',
    additionalProperties: true,
    required: [
        'country',
    ],
    properties: {
        country: templateTypes.string().enum(['ru', 'kaz', 'kgz', 'arm', 'geo']).done(),
    }
};

module.exports = {
    country: countrySchema,
};
