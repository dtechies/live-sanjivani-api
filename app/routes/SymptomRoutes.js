module.exports = (app) => {
  const symptomController = require("../controllers/SymptomController");
  const auth = require("./middleware/auth.middleware");

  var router = require("express").Router();
  router.get("/all-symptom", auth(), symptomController.allSymptom);
  app.use("/", router);
};
