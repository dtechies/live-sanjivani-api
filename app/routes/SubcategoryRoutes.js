module.exports = (app) => {
  const subCategoryController = require("../controllers/SubcategoryController");
  // const validationController = require('../controllers/ValidationController')
  var router = require("express").Router();
  router.get("/all-subcategory", auth(), subCategoryController.allSubCategory);
  router.post("/add-subcategory-value", auth(),
    subCategoryController.addSubCategoryValue,
  );
  app.use("/", router);
};
