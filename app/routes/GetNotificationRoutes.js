module.exports = (app) => {
  const NotificationController = require("../controllers/NotificationController");
  const auth = require("./middleware/auth.middleware");

  var router = require("express").Router();
  router.post(
    "/get-Notification",
    auth(),
    NotificationController.getNotification
  );
  router.post("/send-Notification", NotificationController.sendNotification);
  app.use("/", router);
};
