module.exports = (app) => {
    const SendMailController = require('../controllers/SendMailController');
    const auth = require("./middleware/auth.middleware");

    var router = require('express').Router();
    router.post('/send-Mail', auth(), SendMailController.sendMail);
    app.use('/', router);
};
