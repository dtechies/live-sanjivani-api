module.exports = (app) => {
    const NestedsubcategoryController = require('../controllers/NestedSubcategoryController');
    // const validationController = require('../controllers/ValidationController')
    var router = require('express').Router();
    router.get('/all-nestedsubcategory', [ NestedsubcategoryController.allnestedsubcategory]);
    app.use('/', router);
};
