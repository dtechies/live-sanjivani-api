module.exports = (app) => {
  const usersController = require("../controllers/UsersController");

  var router = require("express").Router();
  router.post("/register-user", [usersController.registerUser]);
  router.post("/user-login", [usersController.usersLogin]);

  app.use("/", router);
};
