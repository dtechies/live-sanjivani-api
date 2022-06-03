module.exports = (app) => {
    const medicineReminderController = require("../controllers/MedicineReminderController");
    const auth = require("./middleware/auth.middleware");

    var router = require("express").Router();
    router.get(
        "/add-medicine-reminder-view",
        auth(),
        medicineReminderController.addMedicineReminderView
    );
    router.post(
        "/add-medicine-reminder",
        auth(),
        medicineReminderController.addMedicineReminder
    );
    router.post(
        "/edit-medicine-reminder-status",
        auth(),
        medicineReminderController.editMedicineReminderStatus
    );
    router.get(
        "/get-medicine-reminder-profile",
        auth(),
        medicineReminderController.getMedicineReminderProfile
    );
    router.get(
        "/get-tip-for-day",
        auth(),
        medicineReminderController.getTipForDay
    );

    app.use("/", router);
};
