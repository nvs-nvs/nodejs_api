const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap
const hallController = require('../Controllers/HallInfoController');
const templateController = require('../Controllers/TemplateController');
const Middlewares = require('../../components/middleware/validators');
const { hallsShema } = require('../schemas/');
const { countrySchema } = require('../../api/schemas');

router
    .route('*')
    .all(
        (req, res, next) => Middlewares.validateGetBody(req, next, countrySchema.country),
    );

router
    .route('/halls')
    .post(
        (req, res, next) => Middlewares.validatePostBody(req, next, hallsShema.post),
        (req, res, next) => hallController.getHallInfo(req, res, next)
    )
    .all((req, res, next) => next(`Unknown url ${req.originalUrl}`));

router
.route('/templates')
.get(
    (req, res, next) => templateController.getAllTemplates(req, res, next)
)
.all((req, res, next) => next(`Unknown url ${req.originalUrl}`));

module.exports = router;