module.exports = (app) => {
    const categoryController = require('../controllers/CategoryController');
    // const validationController = require('../controllers/ValidationController')
    var router = require('express').Router();
    router.get('/all-category', [ categoryController.allCategory]);
    app.use('/', router);
};
