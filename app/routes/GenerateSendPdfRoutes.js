module.exports = (app) => {
    const GenerateSendPdfController = require('../controllers/GenerateSendPdfController');
    const auth = require("./middleware/auth.middleware");

    var router = require('express').Router();
    router.get('/get-subcategory-data', [auth(),GenerateSendPdfController.getSubcategoryData]);
      
    app.use('/', router);
};
