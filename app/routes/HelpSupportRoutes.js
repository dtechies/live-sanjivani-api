module.exports = (app) => {
    const HelpSupportController = require('../controllers/HelpSupportController');
    const auth = require("./middleware/auth.middleware");

    var router = require('express').Router();
    router.get('/get-helpsupport-data', [auth(),HelpSupportController.getHelpSupport]);
      
    app.use('/', router);
};
