module.exports = (app) => {
    const GenerateSendPdfController = require("../controllers/GenerateSendPdfController");
    const auth = require("./middleware/auth.middleware");

    var router = require("express").Router();
    router.post(
        "/get-user-favSubCategories-pdf",
        auth(),
        GenerateSendPdfController.sendMail
    );

    app.use("/", router);
};
