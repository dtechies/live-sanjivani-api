module.exports = (app) => {
  const CareGiverController = require("../controllers/CareGiverController");
  const auth = require("./middleware/auth.middleware");

  var router = require("express").Router();
  router.post("/add-user-CareGiver", auth(), CareGiverController.addCareGiver);
  router.get("/get-caregiver", auth(), CareGiverController.caregiverData);
  router.delete(
    "/delete-caregiver",
    auth(),
    CareGiverController.deleteCareGiver
  );

  app.use("/", router);
};
