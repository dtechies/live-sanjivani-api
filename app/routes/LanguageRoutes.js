module.exports = (app) => {
  const languageController = require("../controllers/LanguageController");
  // const validationController = require('../controllers/ValidationController')
  var router = require("express").Router();
  router.get("/all-language", auth(), languageController.allLanguage);
  app.use("/", router);
};
