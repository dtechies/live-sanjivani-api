var cron = require("node-cron");
exports.sendNotification = function(req, res, cb) {
  cron.schedule(
    "* * * * * *",
    () => {
      require("../app/controllers/NotificationController").sendNotification();
      require("../app/controllers/NotificationController").sendNotificationForAppointmentReminder();
    },
    {
      scheduled: true,
      timezone: "Asia/Kolkata"
    }
  );
};

exports.clearRemainders = function(req, res, cb) {
  cron.schedule(
    "0 0 0 * * *",
    () => {
      require("../app/controllers/NotificationController").clearRemainders();
    },
    {
      scheduled: true,
      timezone: "Asia/Kolkata"
    }
  );
};
