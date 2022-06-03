module.exports = (app) => {
  const UploadProfilePicController = require("../controllers/UploadProfilePicController");
  const auth = require("./middleware/auth.middleware");

  var router = require("express").Router();
  router.post(
    "/add-edit-user-profile-pic",
    auth(),
    UploadProfilePicController.addEditUserProfilePic
  );

  app.use("/", router);
};
