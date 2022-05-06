module.exports = (app) => {
    const newsLetterController = require('../controllers/NewsLetterEmailsController');
    const validationController = require('../controllers/ValidationController')
    var router = require('express').Router();
    router.post('/subscribenewsletter', [validationController.validatenewsLetterEmail, newsLetterController.newsLetterEmail]);
    
    app.use('/', router);
};