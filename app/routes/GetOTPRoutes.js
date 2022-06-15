module.exports = (app) => {
  const OTPController = require("../controllers/OTPController");

  var router = require("express").Router();
  router.post("/get-OTP", OTPController.getOTP);
  router.post("/store-OTP", OTPController.storeOTP);
  app.use("/", router);
};
