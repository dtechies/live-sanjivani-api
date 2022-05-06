module.exports = (app) => {
    const OTPController = require('../controllers/OTPController');
     const auth = require("./middleware/auth.middleware");
   
    var router = require('express').Router();
    router.post('/get-OTP', OTPController.getOTP);
     app.use('/', router);
    };
