/* eslint-disable */
const templateTypes = require('mobitel-json-schema-template');

// Config file schema
module.exports = {
    id: 'config',
    type: 'object',
    additionalProperties: true,
    required: [
        'auth',
        'log',
        'api',
        'storage'
    ],
    properties: {
        // Auth settings
        auth: {
            type: 'object',
            additionalProperties: false,
            required: [
                'token_key',
                'auth_url',
                'client_id',
                'client_secret',
            ],
            properties: {
                token_key : templateTypes.string().done(),
                auth_url : templateTypes.string().done(),
                client_id : templateTypes.string().done(),
                client_secret : templateTypes.string().done(),
            },
        },
        // Logger settings
        log: {
            type: 'object',
            additionalProperties: false,
            required: [
                'type',
                'filePath',
                'fileLevel',
                'consoleLevel',
            ],
            properties: {
                type: templateTypes.string().enum(['console', 'file', 'both']).done(), // Log type
                filePath: templateTypes.string().done(), // Path to log file
                // Log level for log in file
                fileLevel: templateTypes.string().enum(['error', 'warn', 'info', 'verbose', 'debug', 'silly']).done(),
                // Log level for log in console
                consoleLevel: templateTypes.string().enum(['error', 'warn', 'info', 'verbose', 'debug', 'silly']).done(),
            },
        },
        api: {
            type: 'object',
            required: [
                'port',
            ],
            properties: {
                port: templateTypes.integer().min(1).done(), // api port
            },
        },
        // Connections to storage
        storage: {
            type: 'object',
            required: [
                'mysql-replica',
                'mysql-master',
            ],
            patternProperties: {
                "^mysql-": {
                    type: 'object',
                    required: [
                        'host',
                        'port',
                        'user',
                        'password'
                    ],
                    properties: {
                        host: templateTypes.string().anyOf(
                            [
                                templateTypes.stringFormat('hostname'),
                                templateTypes.stringFormat('ipv4'),
                            ]).done(), // DB host
                        port: templateTypes.integer().min(1).done(), // DB port
                        user: templateTypes.string().done(), // DB user
                        password: templateTypes.string().done(), // DB user password
                        database: templateTypes.string().done(), // DB name
                    },

                },
            },
        },
    },
};
