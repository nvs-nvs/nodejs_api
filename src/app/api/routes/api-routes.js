const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap
const loginController = require('../Controllers/loginController');
const Middlewares = require('../middlewares');
const {blacklistSchema} = require('../schemas');

router
    // .param('id', (req, res, next, id) => Middlewares.validateIntParam(next, id, 'race id'))
    .route('/race')
    .get((req, res, next) => loginController.my_test(req, res, next))
    .all((req, res, next) => next(`Unsupported endpoint ${req.originalUrl}`));

module.exports = router;