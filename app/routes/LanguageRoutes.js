module.exports = (app) => {
  const languageController = require("../controllers/LanguageController");
  const auth = require("./middleware/auth.middleware");

  // const validationController = require('../controllers/ValidationController')
  var router = require("express").Router();
  router.get("/all-language", auth(), languageController.allLanguage);
  app.use("/", router);
};
