module.exports = (app) => {
  const medicationListController = require("../controllers/MedicationListController");
  const auth = require("./middleware/auth.middleware");

  var router = require("express").Router();
  router.post(
    "/medication-list",
    auth(),
    medicationListController.medicationList
  );
  app.use("/", router);
};
