module.exports = (app) => {
  const languageController = require("../controllers/LanguageController");
  const auth = require("./middleware/auth.middleware");

  // const validationController = require('../controllers/ValidationController')
  var router = require("express").Router();
  router.get("/all-language", auth(), languageController.allLanguage);
  router.get("/test-endpoint", (req, res, next) => {
    res.status(200).json({
      success: true,
      data: {
        message: "Hello, welcome live-sanjivani",
      },
    });
  });
  app.use("/", router);
};
