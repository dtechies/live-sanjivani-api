module.exports = (app) => {
  const HelpSupportController = require("../controllers/HelpSupportController");
  const auth = require("./middleware/auth.middleware");

  var router = require("express").Router();
  router.get(
    "/get-helpsupport-data",
    auth(),
    HelpSupportController.getHelpSupport
  );
  router.delete(
    "/delete-helpsupport-data",
    auth(),
    HelpSupportController.deleteHelpSupport
  );

  app.use("/", router);
};
