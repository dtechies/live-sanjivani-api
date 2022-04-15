module.exports = (app) => {
    const usersController = require('../controllers/UsersController');
    const auth = require("./middleware/auth.middleware");

    var router = require('express').Router();
    router.post('/register-user', [usersController.registerUser]);
    router.post('/user-login', [usersController.usersLogin]);
    router.get('/get-reminder-options', [auth(),usersController.getReminderOptions]);
    
    app.use('/', router);
};