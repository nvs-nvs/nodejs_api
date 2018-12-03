const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap
const Middlewares = require('../middlewares');
const { loginSchema } = require('../schemas/');
const hallController = require('../Controllers/hallInfoController');

router
        .route('/')
        .post(
            (req, res, next) => Middlewares.validateBody(req, next, loginSchema.post),
            (req, res, next) => hallController.getAllHalls(req, res, next)
        )
        .all((req, res, next) => next(`Unknown url ${req.originalUrl}`));

module.exports = router;