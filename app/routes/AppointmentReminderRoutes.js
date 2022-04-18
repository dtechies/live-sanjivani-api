module.exports = (app) => {
    const appointmentReminderController = require('../controllers/AppointmentReminderController');
    const auth = require("./middleware/auth.middleware");

    var router = require('express').Router();
    router.get('/get-appointment-reminder-list', [auth(),appointmentReminderController.getAppointmentReminderList]);
    router.post('/add-appointment-reminder', [auth(),appointmentReminderController.addAppointmentReminder]);
    router.post('/edit-appointment-reminder-status', [auth(),appointmentReminderController.editAppointmentReminderStatus]);
    router.get('/get-appointment-reminder-profile', [auth(),appointmentReminderController.getAppointmentReminderProfile]);
   
    app.use('/', router);
};
