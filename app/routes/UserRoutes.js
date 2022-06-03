module.exports = (app) => {
  const usersController = require("../controllers/UsersController");

  var router = require("express").Router();
  router.post("/register-user", auth(), usersController.registerUser);
  router.post("/user-login", auth(), usersController.usersLogin);

  app.use("/", router);
};
