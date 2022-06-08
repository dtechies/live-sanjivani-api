module.exports = (app) => {
  const usersController = require("../controllers/UsersController");
  const auth = require("./middleware/auth.middleware");

  var router = require("express").Router();
  router.post("/register-user", usersController.registerUser);
  router.post("/user-login", usersController.usersLogin);
  router.post("/add-edit-player-id", auth(), usersController.addEditPlayerId);

  app.use("/", router);
};
