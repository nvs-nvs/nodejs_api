const templateTypes = require('mobitel-json-schema-template');

const mainData = {
    id: 'race_data_main',
    type: 'object',
    additionalProperties: false,
    properties: {
        gameKinds: templateTypes.array()
            .min(1)
            .unique()
            .items([templateTypes.number().done()])
            .done(),

        prizeFund: templateTypes.number().min(0).done(),
        useBonuses: templateTypes.boolean(),
        winnersCount: templateTypes.number().min(1).done(),
        startDate: templateTypes.string().done(),
        endDate: templateTypes.string().done(),
        participantsHalls: templateTypes.array()
            .min(1)
            .unique()
            .items([templateTypes.number().done()])
            .done(),
        prizes: templateTypes.array()
            .min(0)
            .items([templateTypes.number().min(0).done()])
            .done(),
        acceptBonuses: templateTypes.boolean(),
        minWinSum: templateTypes.number().min(0).done(),
        minRacers: templateTypes.number().min(0).done(),
        status: templateTypes.string().enum(['WAITING', 'PENDING', 'CANCELLED']).done(),
        megarace: templateTypes.boolean(),
        acceptJackpots: templateTypes.boolean(),
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

const required = [
    'gameKinds',
    'prizeFund',
    'useBonuses',
    'winnersCount',
    'startDate',
    'endDate',
    'participantsHalls',
    'prizes',
    'acceptBonuses',
    'minWinSum',
    'minRacers',
    'status',
    'megarace',
    'acceptJackpots',
    'gameSettings',
];

module.exports = {
    post: {...mainData, required},
    update: mainData,
};
