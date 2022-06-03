module.exports = (app) => {
  const NestedsubcategoryController = require("../controllers/NestedSubcategoryController");
  const auth = require("./middleware/auth.middleware");

  // const validationController = require('../controllers/ValidationController')
  var router = require("express").Router();
  router.get(
    "/all-nestedsubcategory",
    auth(),
    NestedsubcategoryController.allnestedsubcategory
  );
  app.use("/", router);
};
