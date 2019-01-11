const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap
const Validators = require('../../components/middleware/validators');
const { loginSchema } = require('../schemas/');
const loginController = require('../Controllers/LoginController');

router
        .route('/')
        .post(
            (req, res, next) => Validators.validatePostBody(req, next, loginSchema.post),
            (req, res, next) => loginController.login(req, res, next)
        )
        .all((req, res, next) => next(`Unknown url ${req.originalUrl}`));

module.exports = router;