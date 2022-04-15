module.exports = (app) => {
    const medicineReminderController = require('../controllers/MedicineReminderController');
    const auth = require("./middleware/auth.middleware");

    var router = require('express').Router();
    router.get('/get-medicine-reminder-list', [auth(),medicineReminderController.getMedicineReminderList]);
    router.post('/add-medicine-reminder', [auth(),medicineReminderController.addMedicineReminder]);
    
    app.use('/', router);
};