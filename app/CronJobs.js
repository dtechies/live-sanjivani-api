var cron = require("node-cron");
exports.sendNotification = function (req, res, cb) {
  cron.schedule(
    "* * * * * *",
    () => {
      require("../app/controllers/NotificationController").sendNotification();
      require("../app/controllers/NotificationController").sendNotificationForAppointmentReminder();
    },
    {
      scheduled: true,
      timezone: "Asia/Kolkata",
    }
  );
};
