module.exports = (app) => {
    const NotificationController = require('../controllers/NotificationController');
     const auth = require("./middleware/auth.middleware");
   
    var router = require('express').Router();
    router.post('/get-Notification',[auth(), NotificationController.getNotification]);
     app.use('/', router);
    };
