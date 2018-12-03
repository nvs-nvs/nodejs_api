const templateTypes = require('mobitel-json-schema-template');

const mainData = {
    id: 'race_data_main',
    type: 'object',
    additionalProperties: false,
    required: [
        'gameSettings',
    ],
    properties: {
        gameSettings: templateTypes.array()
            .min(0)
            .items([{
                type: 'object',
                additionalProperties: false,
                required: [
                    'percentage',
                    'kind',
                    'type',
                ],
                properties: {
                    percentage: templateTypes.number().min(0).done(),
                    kind: templateTypes.number().min(0).done(),
                    type: templateTypes.boolean(),
                },
            }])
            .unique()
            .done(),
    },
};

module.exports = {
    post: mainData,
};
