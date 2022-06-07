module.exports = (app) => {
  const UserProfileController = require("../controllers/UserProfileController");
  const auth = require("./middleware/auth.middleware");

  var router = require("express").Router();
  router.post(
    "/edit-user-profile",
    auth(),
    UserProfileController.editUserProfile
  );
  router.get("/get-user-profile-data", [
    auth(),
    UserProfileController.getUserProfileData,
  ]);

  app.use("/", router);
};
