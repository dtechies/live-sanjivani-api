module.exports = (app) => {
    const categoryController = require('../controllers/CategoryController');
    // const validationController = require('../controllers/ValidationController')
    var router = require('express').Router();
    router.get('/all-category', [ categoryController.allCategory]);
    router.get('/all_cat_subcategory', [ categoryController.allCatSubCategory]);
    router.post('/generatePdf', [ categoryController.generatePdf]);
    app.use('/', router);
};
