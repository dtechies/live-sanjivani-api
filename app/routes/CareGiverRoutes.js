module.exports = (app) => {
  const CareGiverController = require("../controllers/CareGiverController");
  const auth = require("./middleware/auth.middleware");

  var router = require("express").Router();
  router.post("/add-user-CareGiver", auth(), CareGiverController.addCareGiver);
  app.use("/", router);
};
