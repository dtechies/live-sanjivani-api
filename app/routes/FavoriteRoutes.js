module.exports = (app) => {
  const favoriteController = require("../controllers/FavoriteController");
  const auth = require("./middleware/auth.middleware");

  // const validationController = require('../controllers/ValidationController')
  var router = require("express").Router();
  router.get("/user-favorites-list", auth(), favoriteController.userFavorites);
  router.post("/add-user-favorites", auth(), favoriteController.addFavorites);
  //router.post('/edit-user-favorites-list', [ favoriteController.editFavoritesList]);

  app.use("/", router);
};
