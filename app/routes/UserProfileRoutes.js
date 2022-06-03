module.exports = (app) => {
  const UserProfileController = require("../controllers/UserProfileController");
  const auth = require("./middleware/auth.middleware");

  var router = require("express").Router();
  router.post(
    "/edit-user-profile",
    auth(),
    UserProfileController.editUserProfile
  );

  app.use("/", router);
};
