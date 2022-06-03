module.exports = (app) => {
    const categoryController = require("../controllers/CategoryController");
    const auth = require("./middleware/auth.middleware");

    // const validationController = require('../controllers/ValidationController')
    var router = require("express").Router();
    router.get("/all-category", auth(), categoryController.allCategory);
    router.get(
        "/all_cat_subcategory",
        auth(),
        categoryController.allCatSubCategory
    );
    router.post("/generatePdf", auth(), categoryController.generatePdf);
    app.use("/", router);
};
