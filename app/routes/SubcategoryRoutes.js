module.exports = (app) => {
  const subCategoryController = require("../controllers/SubcategoryController");
  const auth = require("./middleware/auth.middleware");

  // const validationController = require('../controllers/ValidationController')
  var router = require("express").Router();
  router.get("/all-subcategory", auth(), subCategoryController.allSubCategory);
  router.post(
    "/add-subcategory-value",
    auth(),
    subCategoryController.addSubCategoryValue
  );
  router.post(
    "/subcategory-graph",
    auth(),
    subCategoryController.getSubCategoryGraph
  );
  app.use("/", router);
};
