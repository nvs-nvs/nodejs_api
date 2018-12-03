const templateTypes = require('mobitel-json-schema-template');

const mainData = {
    id: 'blacklist_data_main',
    type: 'object',
    additionalProperties: false,
    properties: {
        walletID: templateTypes.number().min(0).done(),
        phone: templateTypes.string().done(),
        docType: templateTypes.string().done(),
        docNumber: templateTypes.string().done(),
    },
    anyOf: [
        {
            required: ['docType', 'docNumber'],
        },
        {
            required: ['walletID'],
        },
        {
            required: ['phone'],
        },
    ],
};

module.exports = {
    post: mainData,
};
