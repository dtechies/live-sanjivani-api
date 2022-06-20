module.exports = (app) => {
  const ContactUsController = require("../controllers/ContactUsController");
  const auth = require("./middleware/auth.middleware");
  var router = require("express").Router();

  router.post("/add-feedback", auth(), ContactUsController.addFeedback);
  app.use("/", router);
};
