module.exports = (app) => {
  const subCategoryController = require("../controllers/SubcategoryController");
  // const validationController = require('../controllers/ValidationController')
  var router = require("express").Router();
  router.get("/all-subcategory", [subCategoryController.allSubCategory]);
  router.get("/add-subcategory-value", [
    subCategoryController.addSubCategoryValue,
  ]);
  app.use("/", router);
};
