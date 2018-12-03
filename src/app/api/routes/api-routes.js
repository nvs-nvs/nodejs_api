const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap
const hallController = require('../Controllers/hallInfoController');
const Middlewares = require('../middlewares');
const {blacklistSchema} = require('../schemas');

router
    .param('country', (req, res, next, country) =>
        Middlewares.validateStringParam(next, country, 'kazrukgzarmgeo', 'country'))
    .route('/halls')
    .get(
        (req, res, next) => Middlewares.jwt(req, res, next),
        (req, res, next) => hallController.getAllHalls(req, res, next)
    )
    .all((req, res, next) => next(`Unknown url ${req.originalUrl}`));

module.exports = router;