module.exports = (app) => {
  const OTPController = require("../controllers/OTPController");

  var router = require("express").Router();
  router.post("/get-OTP", OTPController.getOTP);
  app.use("/", router);
};
