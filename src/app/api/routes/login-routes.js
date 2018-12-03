const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap
const Middlewares = require('../middlewares');
const { loginSchema } = require('../schemas/');
const loginController = require('../Controllers/loginController');

router
        .route('/')
        .post(
            (req, res, next) => Middlewares.validateBody(req, next, loginSchema.post),
            (req, res, next) => loginController.login(req, res, next)
        )
        .all((req, res, next) => next(`Unknown url ${req.originalUrl}`));

module.exports = router;